# frozen_string_literal: true

FactoryBot.define do
  factory :parish do
    sequence(:name) { |n| "Parish #{n}" }
    sequence(:code) { |n| "P#{n % 100}" }
    description { Faker::Lorem.paragraph(sentence_count: 2) }
    active { true }
    population { Faker::Number.between(from: 50000, to: 300000) }
    main_city { Faker::Address.city }
    latitude { Faker::Address.latitude }
    longitude { Faker::Address.longitude }

    trait :kingston do
      name { "Kingston" }
      code { "KIN" }
      description { "The capital and largest city of Jamaica" }
      population { 662426 }
      main_city { "Kingston" }
      latitude { 18.0179 }
      longitude { -76.8099 }
    end

    trait :st_andrew do
      name { "St. Andrew" }
      code { "STA" }
      description { "Parish in the county of Surrey, Jamaica" }
      population { 573369 }
      main_city { "Half Way Tree" }
      latitude { 18.0747 }
      longitude { -76.7951 }
    end
  end
end
