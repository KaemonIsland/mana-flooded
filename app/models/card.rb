class Card < ApplicationRecord
  include CardStats

  has_many :card_set_cards
  has_many :card_sets, through: :card_set_cards

  has_many :collected_cards, dependent: :destroy
  has_many :collections, through: :collected_cards

  has_many :decked_cards, dependent: :destroy
  has_many :decks, through: :decked_cards

  validates :uuid, presence: true, uniqueness: { case_sensitive: false }

  # Serialize Objects/Arrays https://api.rubyonrails.org/classes/ActiveRecord/AttributeMethods/Serialization/ClassMethods.html
  # serialize :leadership_skills, JSON

  # Return all Legalities for a card
  def legalities
    Legality.where(uuid: self.uuid)
  end

  # Return all rulings for a card
  def rulings
    Ruling.where(uuid: self.uuid)
  end

  def identifiers
    Identifier.where(uuid: self.uuid)
  end

  def purchase_urls
    PurchaseUrl.where(uuid: self.uuid)
  end

  def prices
    Price.where(uuid: self.uuid)
  end

  # Gets the locations the card is currently used in. (Decks, Collections)
  def locations(user_id)
    location = []

    # Find collected_card
    collection = Collection.find_by(user_id: user_id)
    collected = CollectedCard.find_by(card_id: self.id, collection_id: collection.id)

    # Add collection type if collected_card found
    if collected
      location << { type: 'collection', quantity: collected.quantity, foil: collected.foil }
    end

    # Finds decks the card belongs to
    deck_ids = User.find(user_id).decks.ids
    decked = DeckedCard.where(deck_id: deck_ids, card_id: self.id)

    # Add decked cards if decked found
    if decked.present?
      decked.each do |decked_card|
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

    return location
  end

  # Gets the number of cards within the collection
  def collection_quantity(collection_id)
    return 0 unless collection_id

    collected = collected_cards.select { |col| col.collection_id == collection_id }

    collected.empty? ? 0 : collected.first
  end

  # Gets the number of the card used within a specific deck
  def deck_quantity(deck_id)
    return 0 unless deck_id

    decked = decked_cards.select { |deck| deck.deck_id == deck_id }

    decked.empty? ? 0 : decked.first
  end

  ############## SORTING #############
  # Sorts by mana cost first then alphabetical by name
  def self.by_mana_and_name
    order(mana_value: :asc, name: :asc)
  end

  # Sorts cards by color White, Blue, Black, Red, Green, Colorless, Multi
  def self.sort_by_color(cards)
    # All card colors to be sorted by.
    # W = White
    # U = Blue
    # B = Black
    # R = Red
    # G = Green
    # M = Multi - Any card with more than one color within color_identity
    # C = Colorless - Any card with an empty color_identity
    @colors = {
      W: [],
      U: [],
      B: [],
      R: [],
      G: [],
      M: [],
      C: [],
    }

    cards.each do |card|
      card_colors = card.color_identity || []

      if card_colors.empty?
        @colors[:C] << card
      elsif card_colors.length >= 2
        @colors[:M] << card
      else
        @colors[card_colors[0].to_sym] << card
      end
    end

    [].concat(
      @colors[:W],
      @colors[:U],
      @colors[:B],
      @colors[:R],
      @colors[:G],
      @colors[:M],
      @colors[:C])
  end

  ############## RANSACK #############

  def self.ransackable_attributes(auth_object = nil)
    ["artist", "artist_ids", "ascii_name", "atraction_lights", "availability", "booster_types", "border_color", "card_parts", "card_set_id", "card_type", "color_identity", "color_indicator", "colors", "defense", "duel_deck", "edhrec_rank", "edhrec_saltiness", "face_converted_mana_cost", "face_flavor_name", "face_mana_value", "face_name", "finishes", "flavor_name", "flavor_text", "frame_effects", "frame_version", "hand", "has_alternative_deck_limit", "has_content_warning", "has_foil", "has_non_foil", "id", "is_alternative", "is_full_art", "is_funny", "is_online_only", "is_oversized", "is_promo", "is_rebalanced", "is_reprint", "is_reserved", "is_starter", "is_story_spotlight", "is_textless", "is_timeshifted", "keywords", "language", "layout", "leadership_skills", "life", "loyalty", "mana_cost", "mana_value", "name", "number", "original_printings", "original_release_date", "original_text", "original_type", "other_face_ids", "power", "printings", "promo_types", "rarity", "rebalanced_printings", "related_cards", "security_stamp", "set_code", "side", "signature", "subsets", "subtypes", "supertypes", "text", "toughness", "types", "uuid", "variations", "watermark"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["card_set_cards", "card_sets", "collected_cards", "collections", "decked_cards", "decks"]
  end



  ################ SCOPE #################
  # Any card without a color
  scope :colorless, -> { where(color_identity: []) }

  # Any card with more than one color
  scope :multi_color, -> { where('array_length(color_identity, 1) > 1') }

  # Specific Single or Multi color
  scope :combo_color, -> (colors) { where("color_identity @> ARRAY[?]::varchar[]", colors) }

  # Card has color within identity
  scope :single_color, -> (color) { where("'#{color}' = ANY (color_identity)") }

  # Cards that contain exactly specific colors (order-agnostic)
  scope :colors_exact, ->(colors) { 
    where("ARRAY(SELECT unnest(color_identity) ORDER BY 1) = ARRAY(SELECT unnest(ARRAY[:colors]::varchar[]) ORDER BY 1)", colors: colors) 
  }

  # Cards that include specific colors
  scope :colors_include, ->(colors) {
    where(colors.reduce(nil) do |query, color|
      new_condition = arel_table[:color_identity].contains([color])
      query ? query.and(new_condition) : new_condition
    end)
  }

  # Cards that have at most specific colors
  scope :colors_at_most, ->(colors) {
    where("color_identity <@ ARRAY[:colors]::varchar[] AND ARRAY_LENGTH(color_identity, 1) <= :length",
          colors: colors, length: colors.length)
  }

  # Returns cards with any of the specified colors.
  scope :any_of_colors, ->(colors) {
    raise ArgumentError, 'This scope expects between 1 to 5 colors' unless (1..5).include?(colors.length)
    
    colors[1..-1].inject(single_color(colors.first)) {|s, color| s.or(single_color(color)) }
  }



  def self.with_color(card_colors, scope)
    return where.not(color_identity: [nil]) unless card_colors

    colors = card_colors.split(',').uniq

    case
    when colors.length === 1 && colors.first === 'M'
      multi_color
    when colors.length === 1 && colors.first === 'C'
      colorless
    when colors.length >= 2 && colors.include?('M')
      colors.delete('M')
      combo_color(colors).multi_color
    when colors.length === 1
      single_color(colors.first)
    when colors.length > 1
      # If you want cards with any of the specified colors
      any_of_colors(colors)
      # If you want exact match irrespective of order
      # colors_exact(colors)
      # If you want cards that include the specified colors
      # colors_include(colors)
      # If you want cards that have at most the specified colors
      # colors_at_most(colors)
    else
      # This will search for multiple colors in OR fashion (e.g., either red OR blue)
      colors[1..-1].inject(single_color(colors.first)) {|s, color| s.or(scope.single_color(color)) }
    end
end

end
