# frozen_string_literal: true

FactoryBot.define do
  factory :portfolio_image do
    association :trades_person_profile
    sequence(:title) { |n| "Portfolio Image #{n}" }
    description { Faker::Lorem.paragraph(sentence_count: 2) }
    sequence(:display_order) { |n| n }
    active { true }
    image_alt_text { "#{title} - Professional work showcase" }
    metadata { {} }

    after(:build) do |portfolio_image|
      # Create a simple 1x1 pixel image for testing
      image_content = "\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\nIDATx\x9cc```\x00\x00\x00\x04\x00\x01]\xcc\x05\xdb\x00\x00\x00\x00IEND\xaeB`\x82"
      portfolio_image.image.attach(
        io: StringIO.new(image_content),
        filename: "test_image.png",
        content_type: "image/png"
      )
    end

    trait :with_image do
      after(:build) do |portfolio_image|
        # Create a simple 1x1 pixel image for testing
        image_content = "\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\nIDATx\x9cc```\x00\x00\x00\x04\x00\x01]\xcc\x05\xdb\x00\x00\x00\x00IEND\xaeB`\x82"
        portfolio_image.image.attach(
          io: StringIO.new(image_content),
          filename: "test_image.png",
          content_type: "image/png"
        )
      end
    end

    trait :inactive do
      active { false }
    end

    trait :with_full_details do
      title { Faker::Lorem.sentence(word_count: 3).chomp(".") }
      description { Faker::Lorem.paragraph(sentence_count: 3) }
      image_alt_text { "#{title} - Detailed portfolio showcase" }
      metadata { {project_type: "renovation", location: "Kingston", year: 2023} }
    end
  end
end
