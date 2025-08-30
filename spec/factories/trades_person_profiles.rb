# frozen_string_literal: true

FactoryBot.define do
  factory :trades_person_profile do
    association :user, factory: [:user, :tradesperson]
    bio { "Experienced tradesperson with a passion for quality work" }
    company_name { Faker::Company.name }
    years_experience { Faker::Number.between(from: 1, to: 30) }
    hourly_rate { Faker::Number.decimal(l_digits: 2, r_digits: 2) }
    phone { "+1-876-#{Faker::Number.number(digits: 3)}-#{Faker::Number.number(digits: 4)}" }
    website { Faker::Internet.url }
    availability_status { :available }
    description { Faker::Lorem.paragraph(sentence_count: 4) }
    active { true }

    trait :completed do
      profile_completed_at { 1.day.ago }
    end

    trait :incomplete do
      bio { nil }
      description { nil }
      years_experience { nil }
      profile_completed_at { nil }
    end

    trait :busy do
      availability_status { :busy }
    end

    trait :unavailable do
      availability_status { :unavailable }
    end
  end
end
