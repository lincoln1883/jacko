# frozen_string_literal: true

FactoryBot.define do
  factory :trades_person_skill do
    association :trades_person_profile
    association :skill
  end
end
