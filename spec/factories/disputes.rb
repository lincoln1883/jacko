# frozen_string_literal: true

FactoryBot.define do
  factory :dispute do
    association :job
    association :reporter, factory: :user, role: :client
    association :reported_user, factory: :user, role: :supplier
    reason { Faker::Lorem.sentence(word_count: 5) }
    description { Faker::Lorem.paragraph(sentence_count: 3) }
    status { :pending }

    trait :resolved do
      status { :resolved }
    end

    trait :escalated do
      status { :escalated }
    end
  end
end
