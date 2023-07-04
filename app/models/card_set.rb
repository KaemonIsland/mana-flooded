class CardSet < ApplicationRecord
  has_many :card_set_cards
  has_many :cards, through: :card_set_cards

  validates :code, presence: true, uniqueness: { case_sensitive: false }
end
