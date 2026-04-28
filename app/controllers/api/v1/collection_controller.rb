require 'csv'

class Api::V1::CollectionController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :ensure_signed_in
  respond_to :json, :csv

  def export
    @collection = current_user.collection
    @cards = @collection.collected_cards.includes(:card)
    @decks = current_user.decks.includes(decked_cards: :card)

    if request.format.csv?
      return send_data(
        archidekt_collection_csv(@cards),
        filename: archidekt_export_filename,
        type: 'text/csv'
      )
    end

    export_json = {
      cards: @cards.map do |collected_card|
        {
          uuid: collected_card.card.uuid,
          quantity: collected_card.quantity,
          foil: collected_card.foil
        }
      end,
      decks: @decks.map do |deck|
        {
          name: deck.name,
          description: deck.description,
          format: deck.format,
          cards: deck.decked_cards.map do |decked_card|
            {
              uuid: decked_card.card.uuid,
              quantity: decked_card.quantity,
              foil: decked_card.foil,
              categories: decked_card.categories
            }
          end
        }
      end
    }

    render json: export_json, status: 200
  end

  def import
    @collection = current_user.collection

    permitted = params.permit(
      cards: [:uuid, :quantity, :foil],
      decks: [:name, :description, :format, cards: [:uuid, :quantity, :foil, { categories: [] }]]
    )

    cards_data = permitted[:cards] || []
    decks_data = permitted[:decks] || []
    not_found = []

    # Process cards import
    cards_data.each do |card_data|
      card = Card.find_by(uuid: card_data[:uuid])
      unless card
        not_found << card_data
        next
      end

      quantity = card_data[:quantity].to_i
      foil = card_data[:foil].to_i

      collected_card = @collection.collected_cards.find_by(card_id: card.id)
      if collected_card
        new_quantity = collected_card.quantity + quantity
        new_foil = collected_card.foil + foil
        collected_card.update(quantity: new_quantity, foil: new_foil)
      else
        @collection.collected_cards.create(card_id: card.id, quantity: quantity, foil: foil)
      end
    end

    # Process decks import
    decks_data.each do |deck_data|
      deck_params = { name: deck_data[:name], description: deck_data[:description], format: deck_data[:format] }
      deck = current_user.decks.create(deck_params)
      if deck
        (deck_data[:cards] || []).each do |deck_card_data|
          card = Card.find_by(uuid: deck_card_data[:uuid])
          unless card
            not_found << { uuid: deck_card_data[:uuid], deck_id: deck.id }
            next
          end

          quantity = deck_card_data[:quantity].to_i
          foil = deck_card_data[:foil].to_i
          categories = deck_card_data[:categories] || []

          deck.decked_cards.create(card_id: card.id, quantity: quantity, foil: foil, categories: categories)
        end
      end
    end

    Rails.logger.info("Not found during import: #{not_found.inspect}")

    render json: { success: 'Collection imported Successfully!' }, status: 201
  rescue => e
    render json: { error: 'Unable to import collection', details: e.message }, status: 400
  end

  def sets
    @collection = current_user.collection
    set_codes = @collection.set_codes
    @card_sets = CardSet.where(code: set_codes).sort_by(&:release_date).reverse

    card_sets_json = @card_sets.map do |card_set|
      card_set.attributes.merge(unique: @collection.count_by_set(card_set.code))
    end

    render json: card_sets_json, status: 200
  end

  private

  def archidekt_export_filename
    "mana_flood_collection_#{Time.zone.today}.csv"
  end

  def archidekt_collection_csv(collected_cards)
    cards = collected_cards.map(&:card)
    identifiers_by_uuid = Identifier.where(uuid: cards.map(&:uuid)).index_by(&:uuid)
    sets_by_code = CardSet.where(code: cards.map(&:set_code).uniq.compact).index_by(&:code)

    CSV.generate(headers: true) do |csv|
      csv << ['Quantity', 'Card name', 'Edition name', 'Condition', 'Language', 'Foil/Variant', 'Scryfall ID', 'Collector number']

      collected_cards.each do |collected_card|
        card = collected_card.card
        scryfall_id = identifiers_by_uuid[card.uuid]&.scryfall_id
        set_name = sets_by_code[card.set_code]&.name || card.set_code

        csv_rows_for_card(collected_card, card.name, set_name, scryfall_id, card.number).each do |row|
          csv << row
        end
      end
    end
  end

  def csv_rows_for_card(collected_card, card_name, set_name, scryfall_id, collector_number)
    rows = []
    non_foil_count = collected_card.quantity.to_i - collected_card.foil.to_i

    if non_foil_count.positive?
      rows << collection_export_row(
        quantity: non_foil_count,
        name: card_name,
        edition: set_name,
        foil_variant: nil,
        scryfall_id: scryfall_id,
        collector_number: collector_number
      )
    end

    if collected_card.foil.to_i.positive?
      rows << collection_export_row(
        quantity: collected_card.foil.to_i,
        name: card_name,
        edition: set_name,
        foil_variant: 'Foil',
        scryfall_id: scryfall_id,
        collector_number: collector_number
      )
    end

    rows
  end

  def collection_export_row(quantity:, name:, edition:, foil_variant:, scryfall_id:, collector_number:)
    [
      quantity,
      name,
      edition,
      'Near Mint',
      'English',
      foil_variant,
      scryfall_id,
      collector_number
    ]
  end

  def ensure_signed_in
    unless current_user
      render json: { error: 'User must be signed in' }, status: 401
    end
  end
end
