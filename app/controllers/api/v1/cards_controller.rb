class Api::V1::CardsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :ensure_signed_in, only: [:collection, :deck, :search_with_collection, :search_with_deck]
  before_action :load_collection, only: [:collection, :search_with_collection, :search_with_deck, :deck]
  before_action :load_card, only: [:collection, :deck]
  before_action :set_variations, only: [:collection, :deck]
  before_action :load_query, only: [:search_with_collection, :search_with_deck]
  respond_to :json

  def collection
    render 'api/v1/card/collection', status: 200
  end

  def deck
    @deck = Deck.find_by(id: params[:deck_id])
    unless @deck
      return render json: { error: 'Deck not found' }, status: 404
    end
    render 'api/v1/card/deck', status: 200
  end

  def search_with_collection
    @cards = Kaminari.paginate_array(@sorted_cards)
                      .page(params[:page])
                      .per(params[:per_page] || 30)
    render 'api/v1/cards/cards', status: 200
  end

  def search_with_deck
    @deck = Deck.find_by(id: params[:deck_id])
    unless @deck
      return render json: { error: 'Deck not found' }, status: 404
    end

    @cards = Kaminari.paginate_array(@sorted_cards)
                      .page(params[:page])
                      .per(params[:per_page] || 30)
    render 'api/v1/cards/cards', status: 200
  end

  private

  def ensure_signed_in
    unless current_user
      render json: { error: 'User must be signed in' }, status: 401 and return
    end
  end

  def load_query
    # Use safe navigation for nested parameters
    collection_only = params.dig(:q, :collection_only)
    price_min = params.dig(:q, :price_gteq)
    price_max = params.dig(:q, :price_lteq)
    colors = params[:colors]

    base_scope = if collection_only && @collection
                   @collection.cards
                 else
                   Card
                 end

    base_scope = colors.present? ? base_scope.with_color(colors, Card) : base_scope
    base_scope = Card.with_price_range(base_scope, min_price: price_min, max_price: price_max)

    query_params = params[:q]&.except(:price_gteq, :price_lteq)
    @query = base_scope.includes(:price_records).order("original_release_date ASC").ransack(query_params)
    # Limiting here; consider if this needs to be pushed down to the database instead.
    @sorted_cards = Card.sort_cards(@query.result.limit(50000), params[:sort])
    @stats = Card.card_stats(@sorted_cards)
  end

  def load_card
    @card = Card.find(params[:id])
  end

  def load_collection
    @collection = current_user.collection
  end

  def set_variations
    @variations = []
    return if @card.variations.blank?

    card_variations = @card.variations.split(',')
    card_variations.each do |variation|
      variant = Card.find_by(uuid: variation)
      next unless variant
      @variations << { id: variant.id, uuid: variation, scryfall_id: variant.scryfall_id }
    end
  end
end
