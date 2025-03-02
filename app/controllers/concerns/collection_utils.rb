module CollectionUtils
  extend ActiveSupport::Concern

  # Returns true if the card exists in the collection, false otherwise.
  def in_collection?(collection, card)
    collection&.collected_cards&.exists?(card_id: card.id) || false
  end

  # Returns the quantity of a specific card in a collection, or 0 if not found.
  def collection_quantity(collection, card)
    return 0 unless collection && card
    collected_card = collection.collected_cards.find_by(card_id: card.id)
    collected_card ? collected_card.quantity : 0
  end

  # Returns true if the card exists in the deck, false otherwise.
  def in_deck?(deck, card)
    deck&.decked_cards&.exists?(card_id: card.id) || false
  end

  # Returns the quantity of a specific card in a deck, or 0 if not found.
  def deck_quantity(deck, card)
    return 0 unless deck && card
    decked_card = deck.decked_cards.find_by(card_id: card.id)
    decked_card ? decked_card.quantity : 0
  end
end
