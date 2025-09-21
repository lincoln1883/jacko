# frozen_string_literal: true

FactoryBot.define do
  factory :parish do
    sequence(:name) { |n| "Parish #{n}" }
    sequence(:code) { |n| Faker::Alphanumeric.alpha(number: 3).upcase }
    active { true }
  end
end
