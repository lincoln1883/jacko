# frozen_string_literal: true

FactoryBot.define do
  factory :review do
    job { nil }
    reviewer { nil }
    reviewee { nil }
    rating { 1 }
    comment { "MyText" }
  end
end
