class Api::V1::CardSetsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :load_set, only: [:show, :collection, :deck]
  before_action :ensure_signed_in, only: [:collection, :deck]
  respond_to :json

  def index
    @card_sets = CardSet.all.order("release_date DESC")
    render json: @card_sets
  end

  def show
    render json: @set
  end

  def collection
    load_cards
    render 'api/v1/cards/cards', status: 200
  end

  def deck
    load_cards
    @deck = current_user.decks.find(params[:deck_id])
    render 'api/v1/cards/cards', status: 200
  end

  private

    def load_set
      @set = CardSet.find(params[:id])
    end

    def ensure_signed_in
      render json: { error: 'User must be signed in' }, status: :unauthorized unless current_user
    end

    def load_cards
      # We already know current_user exists thanks to ensure_signed_in.
      @collection = current_user.collection
      
      # Use the colors filter if provided.
      cards_relation = @set.cards
      cards_relation = cards_relation.with_color(params[:colors], cards_relation) if params[:colors]
      
      @query = cards_relation.ransack(params[:q])
      # Apply further sorting and stats calculation.
      @sorted_cards = Card.sort_by_color(@query.result.by_mana_and_name)
      @stats = Card.card_stats(@set.cards)
      
      @cards = Kaminari.paginate_array(@sorted_cards)
                        .page(params[:page])
                        .per(params[:per_page] || 30)
    end
end
