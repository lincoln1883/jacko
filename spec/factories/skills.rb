# frozen_string_literal: true

FactoryBot.define do
  factory :skill do
    sequence(:name) { |n| "Skill #{n}" }
    category { "Construction & Building" }
    description { "A professional skill for trade work" }
    active { true }

    trait :electrical do
      category { "Electrical & Electronics" }
      name { "Electrical Wiring" }
      description { "Professional electrical installation and repair" }
    end

    trait :plumbing do
      category { "Plumbing & HVAC" }
      name { "Plumbing Services" }
      description { "Plumbing installation and repair services" }
    end

    trait :inactive do
      active { false }
    end
  end
end
