class Deck < ApplicationRecord
  belongs_to :user
  has_many :decked_cards, dependent: :destroy
  has_many :categories, dependent: :destroy
  has_many :cards, -> { distinct }, through: :decked_cards

  after_create :add_default_categories

  validates :name, presence: true

  # Automatically adds default categories to the deck.
  def add_default_categories
    # Categories that should be included in deck and price calculations.
    %w[Commander Land Planeswalker Enchantment Sorcery Instant Creature Artifact].each do |cat|
      categories.create!(name: cat, included_in_deck: true, included_in_price: true)
    end

    # Categories that should NOT be included in deck and price calculations.
    %w[Maybeboard Sideboard].each do |cat|
      categories.create!(name: cat, included_in_deck: false, included_in_price: false)
    end
  end

  # Returns an array of sorted card colors based on the order: White, Blue, Black, Red, Green.
  def colors
    order = %w[W U B R G]
    # Flatten all card color identities, remove nils, and get unique values.
    card_colors = cards.flat_map { |card| card.color_identity || [] }.uniq
    card_colors.sort_by { |color| order.index(color) || order.size }
  end

  # Computes card statistics for the deck.
  def card_stats
    stats = default_stats

    cards.each do |card|
      deck_qty_record = card.deck_quantity(id)
      multiplier = deck_qty_record ? deck_qty_record.quantity : 0
      next if multiplier.zero?

      stats[:cards] += multiplier
      update_types_and_subtypes(stats, card, multiplier)
      update_colors(stats, card, multiplier)
      update_counts_and_cmc(stats, card, multiplier) unless card.card_type.include?('Basic Land')
    end

    stats
  end

  # Returns the default statistics hash.
  def default_stats
    {
      colors: { M: 0, C: 0, total: 0 },
      types: default_types,
      cmc: Hash.new(0),
      counts: Hash.new(0),
      rarity: Hash.new(0),
      cards: 0
    }
  end

  # Returns a hash for default card types and subtypes.
  def default_types
    %i[creature enchantment instant land sorcery planeswalker artifact].each_with_object({}) do |type, hash|
      hash[type] = { count: 0, subtypes: Hash.new(0) }
    end
  end

  # Updates the statistics for card types and subtypes.
  def update_types_and_subtypes(stats, card, multiplier)
    card.types.each do |type|
      lower_type = type.downcase.to_sym
      if stats[:types].key?(lower_type)
        stats[:types][lower_type][:count] += multiplier
        card.subtypes&.each do |subtype|
          stats[:types][lower_type][:subtypes][subtype.downcase.to_sym] += multiplier
        end
      end
    end
  end

  # Updates color statistics.
  def update_colors(stats, card, multiplier)
    return unless card.color_identity

    if card.color_identity.length > 1
      stats[:colors][:M] += multiplier
    elsif card.color_identity.empty?
      stats[:colors][:C] += multiplier
      stats[:colors][:total] += multiplier
    else
      card.color_identity.each do |color|
        stats[:colors][color.to_sym] += multiplier
        stats[:colors][:total] += multiplier
      end
    end
  end

  # Updates counts and converted mana cost (cmc) statistics.
  def update_counts_and_cmc(stats, card, multiplier)
    stats[:counts][:nonLand] += multiplier
    if card.types.include?('Creature')
      stats[:counts][:creature] += multiplier
    else
      stats[:counts][:nonCreature] += multiplier
    end
    update_cmc(stats, card, multiplier)
    stats[:rarity][card.rarity.to_sym] += multiplier
  end

  # Updates the converted mana cost (cmc) statistics.
  def update_cmc(stats, card, multiplier)
    card_cmc = card.mana_value.to_i
    if card_cmc <= 1
      stats[:cmc][1] += multiplier
    elsif card_cmc >= 6
      stats[:cmc][6] += multiplier
    elsif (2..5).include?(card_cmc)
      stats[:cmc][card_cmc] += multiplier
    end
  end
end
