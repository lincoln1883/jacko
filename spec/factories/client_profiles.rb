# frozen_string_literal: true

FactoryBot.define do
  factory :client_profile do
    association :user, factory: [:user, :client]
    company_name { Faker::Company.name }
    preferred_contact_method { :platform_messaging }
    project_budget_range { "1000_2500" }
    description { "Looking for reliable tradespeople for various home improvement projects." }
    active { true }

    trait :completed do
      profile_completed_at { 1.day.ago }
    end

    trait :incomplete do
      description { nil }
      profile_completed_at { nil }
    end

    trait :individual do
      company_name { nil }
    end

    trait :email_contact do
      preferred_contact_method { :email }
    end

    trait :phone_contact do
      preferred_contact_method { :phone }
    end

    trait :high_budget do
      project_budget_range { "over_10000" }
    end

    trait :low_budget do
      project_budget_range { "under_500" }
    end
  end
end
