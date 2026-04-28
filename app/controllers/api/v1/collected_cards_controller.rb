class Api::V1::CollectedCardsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :ensure_signed_in
  before_action :load_collection
  before_action :load_card, only: [:create, :update, :destroy]
  before_action :load_set, only: [:collection, :deck]
  before_action :load_collected_card, only: [:update, :destroy]
  respond_to :json

  def index
    cards_relation = @collection.cards
    cards_relation = cards_relation.with_color(params[:colors], @collection.cards) if params[:colors].present?
    cards_relation = Card.with_price_range(
      cards_relation,
      min_price: params.dig(:q, :price_gteq),
      max_price: params.dig(:q, :price_lteq)
    )
    @query = cards_relation.ransack(filtered_query_params)
    @sorted_cards = Card.sort_cards(@query.result, params[:sort])
    @stats = Card.card_stats(@collection.cards)
    @cards = Kaminari.paginate_array(@sorted_cards)
                      .page(params[:page])
                      .per(params[:per_page] || 30)
    render 'api/v1/cards/cards', status: 200
  end

  def collection
    collection_set_cards = @collection.with_set_cards(@set.code)
    cards_relation = if params[:colors].present?
                       collection_set_cards.with_color(params[:colors], collection_set_cards)
                     else
                       collection_set_cards
                     end
    cards_relation = Card.with_price_range(
      cards_relation,
      min_price: params.dig(:q, :price_gteq),
      max_price: params.dig(:q, :price_lteq)
    )
    @query = cards_relation.ransack(filtered_query_params)
    @sorted_cards = Card.sort_cards(@query.result, params[:sort])
    @stats = Card.card_stats(collection_set_cards)
    @cards = Kaminari.paginate_array(@sorted_cards)
                      .page(params[:page])
                      .per(params[:per_page] || 30)
    render 'api/v1/cards/cards', status: 200
  end

  def deck
    collection_set_cards = @collection.with_set_cards(@set.code)
    cards_relation = if params[:colors].present?
                       collection_set_cards.with_color(params[:colors], collection_set_cards)
                     else
                       collection_set_cards
                     end
    cards_relation = Card.with_price_range(
      cards_relation,
      min_price: params.dig(:q, :price_gteq),
      max_price: params.dig(:q, :price_lteq)
    )
    @query = cards_relation.ransack(filtered_query_params)
    @sorted_cards = Card.sort_cards(@query.result, params[:sort])
    @stats = Card.card_stats(collection_set_cards)
    @cards = Kaminari.paginate_array(@sorted_cards)
                      .page(params[:page])
                      .per(params[:per_page] || 30)
    @deck = current_user.decks.find_by(id: params[:deck_id])
    unless @deck
      return render json: { error: 'Deck not found' }, status: 404
    end
    render 'api/v1/cards/cards', status: 200
  end

  def create
    if in_collection?(@collection, @card)
      return render json: { error: 'Card already exists in collection' }, status: 400
    end

    if @collection.cards << @card
      @collected_card = @collection.collected_cards.find_by(card_id: @card.id)
      @collected_card.update(collected_card_params)
      render 'api/v1/card/collection', status: 201
    else
      render json: { error: 'Unable to add card to collection' }, status: 400
    end
  end

  def update
    unless in_collection?(@collection, @card)
      @collection.cards << @card
      @collected_card = @collection.collected_cards.find_by(card_id: @card.id)
      @collected_card.update(collected_card_params)
      adjust_foil_count
      return render 'api/v1/card/collection', status: 201
    end

    if @collected_card.update(collected_card_params)
      adjust_foil_count
      render 'api/v1/card/collection', status: 200
    else
      render json: { error: 'Unable to update card quantity' }, status: 400
    end
  end

  def update_multiple
    @deck = Deck.find_by(id: params[:id])
    unless @deck
      return render json: { error: 'Deck not found' }, status: 404
    end

    @deck.decked_cards.each do |card_info|
      card = Card.find_by(id: card_info[:card_id])
      next unless card

      collected_card = @collection.collected_cards.find_by(card_id: card.id)
      if collected_card.nil?
        @collection.cards << card
        collected_card = @collection.collected_cards.find_by(card_id: card.id)
        collected_card.quantity = card_info[:quantity]
        collected_card.foil = card_info[:foil]
      else
        collected_card.quantity += card_info[:quantity].to_i
        collected_card.foil += card_info[:foil].to_i
      end
      collected_card.save
    end

    render 'api/v1/card/collection', status: 200
  rescue => error
    render json: { error: 'Unable to update cards' }, status: 400
  end

  def destroy
    unless in_collection?(@collection, @card)
      return render json: { error: 'Card not in collection' }, status: 404
    end

    if @collected_card.destroy
      render 'api/v1/card/collection', status: 200
    else
      render json: { error: 'Unable to remove card from collection' }, status: 400
    end
  end

  private

  def ensure_signed_in
    unless current_user
      render json: { error: 'User must be signed in' }, status: 401 and return
    end
  end

  def load_card
    @card = Card.find_by(id: params[:id])
    unless @card
      render json: { error: 'Card not found' }, status: 404 and return
    end
  end

  def load_set
    @set = CardSet.find_by(id: params[:id])
    unless @set
      render json: { error: 'Set not found' }, status: 404 and return
    end
  end

  def load_collection
    @collection = current_user.collection
  end

  def load_collected_card
    @collected_card = @collection.collected_cards.find_by(card_id: @card.id)
  end

  def collected_card_params
    params.permit(:quantity, :foil)
  end

  def adjust_foil_count
    if @collected_card.foil > @collected_card.quantity
      @collected_card.foil = @collected_card.quantity
      @collected_card.save
    end
  end

  def filtered_query_params
    params[:q]&.except(:price_gteq, :price_lteq)
  end
end
