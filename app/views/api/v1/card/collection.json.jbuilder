# Returns all card attributes
json.(@card, *@card.attributes.keys)

if !@variations.blank?
  json.variations @variations
end

json.rulings @card.rulings
json.legalities @card.legalities
json.identifiers @card.identifiers
json.purchase_urls @card.purchase_urls
json.prices @card.prices
json.locations @card.locations(current_user.id)

json.collection @card.collection_quantity(@collection.id)