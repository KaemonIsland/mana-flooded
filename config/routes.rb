Rails.application.routes.draw do
  # Revised routes for auth
  devise_for :users,
  path: '',
  controllers: { registrations: 'users/registrations' },
  path_names: { sign_in: 'login', sign_out: 'logout', sign_up: 'register' }

  root 'pages#home'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
