class Api::V1::DecksController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :ensure_signed_in
    before_action :load_deck, only: [:show, :update, :destroy]
    before_action :load_collection, only: [:show, :update, :destroy]
    respond_to :json

    def index
        @decks = current_user.decks.order(updated_at: :desc)
        decks_json = @decks.map do |deck|
        deck.attributes.merge(colors: deck.colors)
        end
        render json: decks_json, status: 200
    end

    def show
        render template: 'api/v1/deck/deck', formats: :json, status: 200
    end

    def create
        @deck = current_user.decks.new(deck_params)
        if @deck.save
        render 'api/v1/deck/deck', status: 200
        else
        render json: { error: 'Unable to create deck', messages: @deck.errors.full_messages }, status: 422
        end
    end

    def update
        if @deck.update(deck_params)
        render 'api/v1/deck/deck', status: 200
        else
        render json: { error: 'Unable to update deck', messages: @deck.errors.full_messages }, status: 422
        end
    end

    def destroy
        if @deck.destroy
        render json: { success: 'Deck deleted successfully' }, status: 200
        else
        render json: { error: 'Unable to delete deck' }, status: 422
        end
    end

    private

    def ensure_signed_in
        unless current_user
        render json: { error: 'User must be signed in' }, status: 401 and return
        end
    end

    def deck_params
        params.permit(:name, :description, :format)
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
end
  