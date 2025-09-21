# frozen_string_literal: true

FactoryBot.define do
  factory :job do
    association :client, factory: :user, role: :client
    association :parish
    title { Faker::Job.title }
    description { Faker::Lorem.paragraph(sentence_count: 5) }
    budget { Faker::Commerce.price(range: 100.0..5000.0) }
    due_date { Faker::Date.forward(days: 30) }
    location { Faker::Address.street_address }
    status { :open }

    after(:build) do |job|
      if job.status == "bidding" || job.status == "in_progress" || job.status == "completed"
        unless job.supplier_profile.present?
          job.supplier_profile = create(:supplier_profile)
        end
      end
    end

    trait :with_supplier do
      association :supplier_profile
    end

    trait :open do
      status { :open }
    end

    trait :completed do
      status { :completed }
      association :supplier_profile # Ensure supplier is present for completed jobs
    end

    trait :in_progress do
      status { :in_progress }
      association :supplier_profile # Ensure supplier is present for in_progress jobs
    end

    trait :cancelled do
      status { :cancelled }
    end
  end
end
