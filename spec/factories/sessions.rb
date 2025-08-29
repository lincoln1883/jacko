FactoryBot.define do
  factory :session do
    user
    
    # Don't set attributes directly, let the model callback handle it
    # The test should set Current values if needed
  end
end
