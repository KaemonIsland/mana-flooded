class Card < ApplicationRecord
  include CardStats

  # Associations
  has_many :card_set_cards
  has_many :card_sets, through: :card_set_cards

  has_many :collected_cards, dependent: :destroy
  has_many :collections, through: :collected_cards

  has_many :decked_cards, dependent: :destroy
  has_many :decks, through: :decked_cards

  # Validations
  validates :uuid, presence: true, uniqueness: { case_sensitive: false }

  # External Data Methods
  def legalities
    Legality.where(uuid: uuid)
  end

  def rulings
    Ruling.where(uuid: uuid)
  end

  def identifiers
    Identifier.where(uuid: uuid)
  end

  def purchase_urls
    PurchaseUrl.where(uuid: uuid)
  end

  def prices
    Price.where(uuid: uuid)
  end

  # Returns locations where the card is used for a given user.
  def locations(user_id)
    location = []

    if (collection = Collection.find_by(user_id: user_id))
      if (collected = CollectedCard.find_by(card_id: id, collection_id: collection.id))
        location << { type: 'collection', quantity: collected.quantity, foil: collected.foil }
      end
    end

    if (user = User.find_by(id: user_id))
      deck_ids = user.decks.pluck(:id)
      DeckedCard.where(deck_id: deck_ids, card_id: id).each do |decked_card|
        deck = decked_card.deck
        location << {
          type: 'deck',
          quantity: decked_card.quantity,
          foil: decked_card.foil,
          name: deck.name,
          description: deck.description,
          format: deck.format,
          deck_id: deck.id
        }
      end
    end

    location
  end

  # Returns the quantity of the card in a specific collection.
  # Returns 0 if not found.
  def collection_quantity(collection_id)
    return 0 unless collection_id

    if (collected = collected_cards.find_by(collection_id: collection_id))
      collected.quantity
    else
      0
    end
  end

  # Returns the quantity of the card in a specific deck.
  # Returns 0 if not found.
  def deck_quantity(deck_id)
    return 0 unless deck_id

    if (decked = decked_cards.find_by(deck_id: deck_id))
      decked.quantity
    else
      0
    end
  end

  ################# SORTING #################
  # Sorts by mana cost then alphabetically by name.
  def self.by_mana_and_name
    order(mana_value: :asc, name: :asc)
  end

  # Sorts cards by a custom color order:
  # White, Blue, Black, Red, Green, Multi, Colorless.
  def self.sort_by_color(cards)
    colors = {
      W: [],
      U: [],
      B: [],
      R: [],
      G: [],
      M: [],
      C: []
    }

    cards.each do |card|
      card_colors = card.color_identity || []
      if card_colors.empty?
        colors[:C] << card
      elsif card_colors.length >= 2
        colors[:M] << card
      else
        colors[card_colors.first.to_sym] << card
      end
    end

    colors[:W] + colors[:U] + colors[:B] + colors[:R] + colors[:G] + colors[:M] + colors[:C]
  end

  ################# RANSACK #################
  def self.ransackable_attributes(auth_object = nil)
    ["artist", "artist_ids", "ascii_name", "atraction_lights", "availability", "booster_types", "border_color", "card_parts", "card_set_id", "card_type", "color_identity", "color_indicator", "colors", "defense", "duel_deck", "edhrec_rank", "edhrec_saltiness", "face_converted_mana_cost", "face_flavor_name", "face_mana_value", "face_name", "finishes", "flavor_name", "flavor_text", "frame_effects", "frame_version", "hand", "has_alternative_deck_limit", "has_content_warning", "has_foil", "has_non_foil", "id", "is_alternative", "is_full_art", "is_funny", "is_online_only", "is_oversized", "is_promo", "is_rebalanced", "is_reprint", "is_reserved", "is_starter", "is_story_spotlight", "is_textless", "is_timeshifted", "keywords", "language", "layout", "leadership_skills", "life", "loyalty", "mana_cost", "mana_value", "name", "number", "original_printings", "original_release_date", "original_text", "original_type", "other_face_ids", "power", "printings", "promo_types", "rarity", "rebalanced_printings", "related_cards", "security_stamp", "set_code", "side", "signature", "subsets", "subtypes", "supertypes", "text", "toughness", "types", "uuid", "variations", "watermark"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["card_set_cards", "card_sets", "collected_cards", "collections", "decked_cards", "decks"]
  end

  ################# SCOPES #################
  scope :colorless, -> { where(color_identity: []) }
  scope :multi_color, -> { where('array_length(color_identity, 1) > 1') }
  scope :combo_color, ->(colors) { where("color_identity @> ARRAY[?]::varchar[]", colors) }
  scope :single_color, ->(color) { where("'#{color}' = ANY (color_identity)") }
  scope :colors_exact, ->(colors) {
    where("ARRAY(SELECT unnest(color_identity) ORDER BY 1) = ARRAY(SELECT unnest(ARRAY[:colors]::varchar[]) ORDER BY 1)", colors: colors)
  }
  scope :colors_include, ->(colors) {
    where(colors.reduce(nil) do |query, color|
      new_condition = arel_table[:color_identity].contains([color])
      query ? query.and(new_condition) : new_condition
    end)
  }
  scope :colors_at_most, ->(colors) {
    where("color_identity <@ ARRAY[:colors]::varchar[] AND ARRAY_LENGTH(color_identity, 1) <= :length",
          colors: colors, length: colors.length)
  }
  scope :any_of_colors, ->(colors) {
    raise ArgumentError, 'This scope expects between 1 to 5 colors' unless (1..5).include?(colors.length)
    colors[1..-1].inject(single_color(colors.first)) { |s, color| s.or(single_color(color)) }
  }

  # Filters cards based on provided color parameters.
  # Accepts a comma-separated string of colors.
  def self.with_color(card_colors, scope)
    return where.not(color_identity: [nil]) unless card_colors

    colors = card_colors.split(',').uniq

    case
    when colors.length == 1 && colors.first == 'M'
      multi_color
    when colors.length == 1 && colors.first == 'C'
      colorless
    when colors.length >= 2 && colors.include?('M')
      colors.delete('M')
      combo_color(colors).multi_color
    when colors.length == 1
      single_color(colors.first)
    when colors.length > 1
      any_of_colors(colors)
    else
      # Fallback to OR search (rare branch)
      colors[1..-1].inject(single_color(colors.first)) { |s, color| s.or(scope.single_color(color)) }
    end
  end
end
