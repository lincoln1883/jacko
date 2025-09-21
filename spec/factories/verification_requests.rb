# frozen_string_literal: true

FactoryBot.define do
  factory :verification_request do
    association :supplier, factory: :user, role: :supplier
    status { :pending }
    notes { "This is a test verification request." }
    after(:build) do |verification_request|
      verification_request.documents.attach(io: File.open(Rails.root.join("spec", "fixtures", "files", "test_document.pdf")), filename: "test_document.pdf", content_type: "application/pdf")
    end
  end
end
