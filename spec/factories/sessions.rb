# frozen_string_literal: true

FactoryBot.define do
  factory :session do
    user

    # Define transient attributes with nil defaults
    # When nil, we'll use Current values if available, otherwise factory defaults
    transient do
      user_agent { nil }
      ip_address { nil }
    end

    # Set Current values before creation so the callback picks them up
    before(:create) do |session, evaluator|
      # If explicit values are provided via transient attributes, use them
      if evaluator.user_agent
        Current.user_agent = evaluator.user_agent
      elsif !Current.user_agent.present?
        # No explicit value and no Current value - use default
        Current.user_agent = "Test Browser"
      end

      if evaluator.ip_address
        Current.ip_address = evaluator.ip_address
      elsif !Current.ip_address.present?
        # No explicit value and no Current value - use default
        Current.ip_address = "127.0.0.1"
      end
    end
  end
end
