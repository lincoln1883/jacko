# frozen_string_literal: true

FactoryBot.define do
  factory :supplier_profile do
    association :user, factory: :user, role: :supplier
    association :parish

    bio { Faker::Lorem.paragraph(sentence_count: 5) }
    company_name { Faker::Company.name }
    description { Faker::Lorem.paragraph(sentence_count: 10) }
    years_experience { Faker::Number.between(from: 1, to: 30) }
    hourly_rate { Faker::Commerce.price(range: 20.0..200.0) }
    phone { Faker::Number.number(digits: 10).to_s }
    website { Faker::Internet.url }
    availability_status { SupplierProfile.availability_statuses.keys.sample }
    experience_level { SupplierProfile.experience_levels.keys.sample }
    service_radius_km { Faker::Number.between(from: 5, to: 100) }
    service_area_notes { Faker::Lorem.sentence }
    active { true }
    profile_completed_at { nil }

    trait :completed do
      profile_completed_at { Time.current }
      after(:create) do |profile|
        create_list(:supplier_skill, 3, supplier_profile: profile) # Ensure skills are present
      end
    end

    trait :incomplete do
      profile_completed_at { nil }
      bio { nil }
      description { nil }
      years_experience { nil }
      experience_level { :graduate }
      # Do not add skills for incomplete trait by default
    end

    trait :with_avatar do
      after(:create) do |profile|
        # Attach a dummy avatar image for testing
        profile.avatar.attach(
          io: File.open(Rails.root.join("spec", "fixtures", "files", "test_image.png")),
          filename: "test_image.png",
          content_type: "image/png"
        )
      end
    end

    trait :inactive do
      active { false }
    end
  end
end
