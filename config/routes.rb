Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # view card sets
      get 'sets', to: 'card_sets#index'
      get 'set/:id', to: 'card_sets#show'
      get 'sets/:id/collection', to: 'card_sets#collection'
      get 'sets/:id/deck/:deck_id', to: 'card_sets#deck'
      
      # Crud operations for users decked_cards
      resources :decks, except: [:new, :edit]
      get 'decked_cards/:id', to: 'decked_cards#index'
      post 'add_decked_card/:id/:card_id', to: 'decked_cards#create'
      put 'add_decked_card/:id/:card_id', to: 'decked_cards#update'
      delete 'remove_decked_card/:id/:card_id', to: 'decked_cards#destroy'
      
      # Crud operations for users card collection
      get 'collection', to: 'collected_cards#index'
      get 'collection/sets', to: 'collection#sets'
      get 'collection/set/:id', to: 'collected_cards#collection'
      get 'collection/set/:id/deck/:deck_id', to: 'collected_cards#deck'
      post 'add_card/:id', to: 'collected_cards#create', as: 'add_card'
      put 'add_card/:id', to: 'collected_cards#update', as: 'update_card'
      delete 'remove_card/:id', to: 'collected_cards#destroy', as: 'remove_card'
      post 'add_cards/:id', to: 'collected_cards#update_multiple'
      
      # Import & Export routes
      get 'collection/export', to: 'collection#export'
      post 'collection/import', to: 'collection#import'

      # Route for user Decks
      get 'decks', to: 'decks#index'
      get 'deck/:id', to:'decks#show'

      # Search Route
      get 'search', to: 'cards#search_with_collection'
      get 'search/deck/:deck_id', to: 'cards#search_with_deck'

      # Routes for single cards
      get 'card/:id', to: 'cards#collection'
      get 'card/:id/deck/:deck_id', to: 'cards#deck'

      # Get user information
      get 'user', to: 'users#show'
    end
  end

  # Revised routes for auth
  devise_for :users,
  path: '',
  controllers: { registrations: 'users/registrations' },
  path_names: { sign_in: 'login', sign_out: 'logout', sign_up: 'register' }

  root 'pages#home'
  get '*path', to: 'pages#home', via: :all
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
