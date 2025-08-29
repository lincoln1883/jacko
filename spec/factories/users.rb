FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "secure_password_123" }
    password_confirmation { "secure_password_123" }
    verified { false }

    trait :verified do
      verified { true }
    end

    trait :unverified do
      verified { false }
    end
  end
end
