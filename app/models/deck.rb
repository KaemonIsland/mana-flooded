class Deck < ApplicationRecord
  belongs_to :user
  has_many :decked_cards, dependent: :destroy
  has_many :categories, dependent: :destroy
  has_many :cards, -> { distinct }, through: :decked_cards

  after_create :add_default_categories

  validates :name, presence: true

  def add_default_categories
    # Categories that should be included with the deck and price calculations
    included = %w[Commander Land Planeswalker Enchantment Sorcery Instant Creature Artifact]

    included.each do |category|
      categories.create!(name: category, included_in_deck: true, included_in_price: true)
    end

    # Default categories that should not be included with the deck and price calculations
    not_included = %w[Maybeboard Sideboard]

    not_included.each do |category|
      categories.create!(name: category, included_in_deck: false, included_in_price: false)
    end
  end

  def colors
    order = ['W', 'U', 'B', 'R', 'G']

    card_colors = self.cards.map(&:color_identity).flatten.compact.uniq

    card_colors.sort_by { |color| order.index(color) }
  end

  # This is the default object for setting all of the stats.

  # colors is a representation of the card colors, not the individual mana costs
  # W = White
  # U = Blue
  # B = Black
  # R = Red
  # G = Green
  # C = Colorless
  # M = Multi

  # types represents each type of card. Ex. Creature, Instant, Land, etc.
  # types contains a count for basic types and an object of subtypes

  # subtypes are for creature types. Ex. Human, Cleric, Beast, Elemental, etc.

  # cmc Converted mana cost counts
  # Note: cmc 1 includes 0 costs and 1 mana. cmc 6 includes 6 or more mana

  # Average is the average mana cost not including lands

  # Rarity keeps track of card rarities
  def card_stats
    stats = default_stats
    cards = self.cards
  
    cards.each do |card|
      multiplier = card.deck_quantity(id).quantity
      stats[:cards] += multiplier
      update_types_and_subtypes(stats, card, multiplier)
      update_colors(stats, card, multiplier)
      update_counts_and_cmc(stats, card, multiplier) unless card.card_type.include?('Basic Land')
    end
  
    stats
  end
  
  def default_stats
    {
      colors: Hash.new(0).merge({M: 0, C: 0, total: 0}),
      types: default_types,
      cmc: Hash.new(0),
      counts: Hash.new(0),
      rarity: Hash.new(0),
      cards: 0,
    }
  end
  
  def default_types
    %i[creature enchantment instant land sorcery planeswalker artifact].each_with_object({}) do |type, hash|
      hash[type] = { count: 0, subtypes: Hash.new(0) }
    end
  end
  
  def update_types_and_subtypes(stats, card, multiplier)
    card.types.each do |type|
      lower_type = type.downcase().to_sym
      if stats[:types][lower_type]
        stats[:types][lower_type][:count] += multiplier
        card.subtypes&.each do |subtype|
          stats[:types][lower_type][:subtypes][subtype.downcase().to_sym] += multiplier
        end
      end
    end
  end
  
  def update_colors(stats, card, multiplier)
    if !card.color_identity
      return
    end

    if card.color_identity.length > 1
      stats[:colors][:M] += multiplier
    elsif card.color_identity.length.zero?
      stats[:colors][:C] += multiplier
      stats[:colors][:total] += multiplier
    else
      card.color_identity.each do |color|
        stats[:colors][color.to_sym] += multiplier
        stats[:colors][:total] += multiplier
      end
    end
  end
  
  def update_counts_and_cmc(stats, card, multiplier)
    stats[:counts][:nonLand] += multiplier
    stats[:counts][:creature] += multiplier if card.types.include?('Creature')
    stats[:counts][:nonCreature] += multiplier unless card.types.include?('Creature')
    update_cmc(stats, card, multiplier)
    stats[:rarity][card.rarity.to_sym] += multiplier
  end
  
  def update_cmc(stats, card, multiplier)
    card_cmc = card.mana_value.to_i
    stats[:cmc][1] += multiplier if card_cmc <= 1
    stats[:cmc][6] += multiplier if card_cmc >= 6
    stats[:cmc][card_cmc] += multiplier if (2..5).include?(card_cmc)
  end
  
end
