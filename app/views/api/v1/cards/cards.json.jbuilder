json.pagination do
  json.page @cards.current_page
  json.perPage @cards.limit_value
  json.totalPages @cards.total_pages
  json.total @cards.total_count
end

if @set
  json.set do
    json.(@set, *@set.attributes.keys)
  end
end

json.stats @stats

json.cards @cards do |card|
  # Returns all card attributes
  json.(card, *card.attributes.keys)

  json.collection card.collection_quantity(@collection.id)

  if @deck
    json.deck card.deck_quantity(@deck.id)
  end

  json.locations card.locations(current_user.id)
end
