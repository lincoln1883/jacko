# frozen_string_literal: true

Rails.application.routes.draw do
  # Removed global pricing calculator routes
  # Removed global review routes

  namespace :admin do
    get "construction_services/index"
    get "construction_services/new"
    get "construction_services/create"
    get "construction_services/edit"
    get "construction_services/update"
    get "construction_services/destroy"
    get "users/index"
    get "users/show"
    get "users/update"
    resources :verification_requests, only: [:index, :show, :update]
    resources :disputes, only: [:index, :show, :update]
    resource :dashboard, only: [:show]
    resources :users, only: [:index, :show, :update]
    resources :jobs
    resources :construction_services
  end
  resources :verification_requests, only: [:new, :create, :show]
  resources :jobs do
    resources :bids, only: [:new, :create, :update]
    resources :reviews, only: [:new, :create]
    resources :disputes, only: [:new, :create]
  end

  resource :pricing_calculator, controller: "pricing_calculator", only: [:show, :create] do
    post :calculate, on: :collection
  end

  # Portfolio images routes
  resources :portfolio_images, except: [:new, :edit] do
    collection do
      post :reorder
    end
  end

  # Avatar management routes
  resource :avatar, only: [:create, :update, :destroy]
  # Profile routes
  resource :profile, only: [] do
    resource :supplier, controller: "supplier_profiles", only: [:show, :edit, :update], as: :supplier
    resource :client, controller: "client_profiles", only: [:show, :edit, :update]
  end
  get  "sign_in", to: "sessions#new"
  post "sign_in", to: "sessions#create"
  delete "sign_out", to: "sessions#destroy_current"
  get  "sign_up", to: "registrations#new"
  post "sign_up", to: "registrations#create"
  resources :sessions, only: [:index, :show, :destroy]
  resource  :password, only: [:edit, :update]
  namespace :identity do
    resource :email,              only: [:edit, :update]
    resource :email_verification, only: [:show, :create]
    resource :password_reset,     only: [:new, :edit, :create, :update]
  end
  # Search routes
  get "search", to: "search#index"
  get "search/suppliers", to: "search#suppliers", as: :search_suppliers

  # Public profile viewing routes
  get "suppliers/:id", to: "supplier_profiles#public_show", as: :public_supplier_profile

  root "home#index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
end
