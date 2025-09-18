# frozen_string_literal: true

FactoryBot.define do
  factory :trades_person_profile do
    association :user, factory: [:user, :tradesperson]
    association :parish
    bio { "Experienced tradesperson with a passion for quality work" }
    company_name { Faker::Company.name }
    years_experience { Faker::Number.between(from: 1, to: 30) }
    hourly_rate { Faker::Number.decimal(l_digits: 2, r_digits: 2) }
    phone { "+1-876-#{Faker::Number.number(digits: 3)}-#{Faker::Number.number(digits: 4)}" }
    website { Faker::Internet.url }
    service_radius_km { Faker::Number.between(from: 1, to: 500) }
    service_area_notes { Faker::Lorem.sentence }
    additional_parishes { ["St. Catherine", "Kingston"] }
    availability_status { :available }
    description { Faker::Lorem.paragraph(sentence_count: 4) }
    active { true }

    trait :completed do
      profile_completed_at { 1.day.ago }

      after(:create) do |profile|
        # Add at least one skill to make the profile complete
        profile.skills << create(:skill) if profile.skills.empty?
      end
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
