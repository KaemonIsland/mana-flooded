class Collection < ApplicationRecord
  belongs_to :user
  has_many :collected_cards, dependent: :destroy
  has_many :cards, -> { distinct }, through: :collected_cards

  # Returns the number of unique cards in the collection.
  def unique_cards_count
    cards.count
  end

  # Returns the total number of cards in the collection.
  def total_cards
    collected_cards.sum(:quantity)
  end

  # Returns an array of unique card set codes present in the collection.
  def set_codes
    cards.distinct.pluck(:set_code)
  end

  # Returns the number of cards from a specific set.
  def count_by_set(card_set_code)
    cards.where(set_code: card_set_code).count
  end

  # Scope-like method to fetch cards for a given set code.
  def with_set_cards(set_code)
    cards.where(set_code: set_code)
  end
end
