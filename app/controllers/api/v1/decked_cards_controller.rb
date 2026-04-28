class Api::V1::DeckedCardsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :ensure_signed_in
  before_action :load_deck, :load_collection, only: [:index, :create, :update, :destroy]
  before_action :load_card, only: [:create, :update, :destroy]
  before_action :load_decked_card, only: [:update, :destroy]
  respond_to :json

  def index
    cards_relation = @deck.cards
    cards_relation = cards_relation.with_color(params[:colors], @deck.cards) if params[:colors].present?
    cards_relation = Card.with_price_range(
      cards_relation,
      min_price: params.dig(:q, :price_gteq),
      max_price: params.dig(:q, :price_lteq)
    )
    @query = cards_relation.ransack(filtered_query_params)
    @sorted_cards = Card.sort_cards(@query.result, params[:sort])
    @cards = Kaminari.paginate_array(@sorted_cards).page(1).per(300)
    render 'api/v1/cards/deck', status: 200
  end

  def create
    if in_deck?(@deck, @card)
      return render json: { error: 'Card is already in this deck' }, status: 400
    end

    if @deck.cards << @card
      @decked_card = @deck.decked_cards.find_by(card_id: @card.id)
      @decked_card.categories = [@card.types.last].compact
      @decked_card.update(decked_card_params)
      adjust_decked_card_foil
      render 'api/v1/card/deck', status: 201
    else
      render json: { error: 'Unable to add card to deck' }, status: 400
    end
  end

  def update
    unless in_deck?(@deck, @card)
      @deck.cards << @card
      @decked_card = @deck.decked_cards.find_by(card_id: @card.id)
      @decked_card.categories = [@card.types.last].compact
      @decked_card.update(decked_card_params)
      adjust_decked_card_foil
      return render 'api/v1/card/deck', status: 201
    end

    if @decked_card.update(decked_card_params)
      adjust_decked_card_foil
      render 'api/v1/card/deck', status: 200
    else
      render json: { error: 'Unable to update card quantity' }, status: 400
    end
  end

  def destroy
    unless in_deck?(@deck, @card)
      return render json: { error: 'Card not in deck' }, status: 404
    end

    if @decked_card.destroy
      render 'api/v1/card/deck', status: 200
    else
      render json: { error: 'Unable to remove card from deck' }, status: 400
    end
  end

  private

  def ensure_signed_in
    unless current_user
      render json: { error: 'User must be signed in' }, status: 401 and return
    end
  end

  def load_deck
    @deck = current_user.decks.find_by(id: params[:id])
    unless @deck
      render json: { error: 'Deck not found' }, status: 404 and return
    end
  end

  def load_collection
    @collection = current_user.collection
  end

  def load_card
    @card = Card.find_by(id: params[:card_id])
    unless @card
      render json: { error: 'Card not found' }, status: 404 and return
    end
  end

  def load_decked_card
    @decked_card = @deck.decked_cards.find_by(card_id: @card.id)
  end

  def decked_card_params
    params.permit(:quantity, :foil, :categories)
  end

  def adjust_decked_card_foil
    if @decked_card.foil > @decked_card.quantity
      @decked_card.update(foil: @decked_card.quantity)
    end
  end

  def filtered_query_params
    params[:q]&.except(:price_gteq, :price_lteq)
  end
end
