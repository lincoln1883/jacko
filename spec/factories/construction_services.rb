# frozen_string_literal: true

FactoryBot.define do
  factory :construction_service do
    sequence(:name) { |n| "Construction Service #{n}" }
    unit { "hour" }
    price { Faker::Commerce.price(range: 20.0..200.0) }
    category { "General" }
  end
end
