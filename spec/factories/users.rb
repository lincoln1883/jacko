# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "secure_password_123" }
    password_confirmation { "secure_password_123" }
    verified { false }
    role { :client }

    trait :verified do
      verified { true }
    end

    trait :unverified do
      verified { false }
    end

    trait :client do
      role { :client }
    end

    trait :supplier do
      role { :supplier }
    end

    trait :admin do
      role { :admin }
    end
  end
end
