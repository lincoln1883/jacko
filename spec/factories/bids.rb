# frozen_string_literal: true

FactoryBot.define do
  factory :bid do
    association :job
    association :supplier_profile
    amount { Faker::Commerce.price(range: 100.0..5000.0) }
    message { Faker::Lorem.paragraph(sentence_count: 2) }
    status { [:pending, :accepted, :rejected].sample }

    trait :accepted do
      status { :accepted }
    end

    trait :rejected do
      status { :rejected }
    end
  end
end
