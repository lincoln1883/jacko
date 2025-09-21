# frozen_string_literal: true

FactoryBot.define do
  factory :supplier_skill do
    association :supplier_profile
    association :skill
  end
end
