class DeckedCard < ApplicationRecord
  belongs_to :card
  belongs_to :deck, touch: true

  before_save :set_default_values, :set_default_category
  after_save :remove_empty_quantity

  validates :deck_id, uniqueness: { scope: :card_id }

  private

  # Set default values for quantity and foil if they're not already set.
  def set_default_values
    self.quantity ||= 1
    self.foil     ||= 0
  end

  # If no categories are set, use the last type from the card.
  def set_default_category
    return unless categories.blank?
    
    card_type = card.types.last
    self.categories << card_type if card_type.present?
  end

  # Remove the record if quantity is zero after saving.
  def remove_empty_quantity
    destroy if quantity.zero?
  end
end
