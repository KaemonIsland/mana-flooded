# Returns all card attributes
json.(@card, *@card.attributes.keys)

if !@variations.nil?
  json.variations @variations
end

json.collection @card.collection_quantity(@collection.id)
json.identifiers @card.identifiers
json.purchase_urls @card.purchase_urls
json.prices @card.prices
json.locations @card.locations(current_user.id)

decked_card = @card.decked_cards.find_by(deck_id: @deck.id)

if decked_card
  json.deck do
    json.quantity decked_card.quantity
    json.foil decked_card.foil
    json.categories decked_card.categories
  end
end
