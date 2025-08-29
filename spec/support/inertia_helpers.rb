# frozen_string_literal: true

module InertiaHelpers
  # Helper to set up Inertia rendering support in tests
  def setup_inertia_test_support
    # Mock the inertia render method to store component and props info
    allow(controller).to receive(:render) do |options = {}|
      if options&.key?(:inertia)
        inertia_data = {
          component: options[:inertia],
          props: options[:props] || {}
        }
        controller.instance_variable_set(:@_inertia, inertia_data)
        
        # Mock the response
        if options[:status] == :unprocessable_content
          controller.response.status = 422
        elsif options[:status] == :unprocessable_entity
          controller.response.status = 422
        elsif options[:status]
          controller.response.status = options[:status]
        end
        
        # Return a rendered state to avoid template lookup
        controller.response.body = "mocked inertia response"
        controller.instance_variable_set(:@_response_body, [controller.response.body])
        
        nil
      else
        # Call the actual render method for non-inertia renders
        original_render(options)
      end
    end
  end

  def original_render(options)
    # Call the actual render method
    super(options) if defined?(super)
  end
end

RSpec.configure do |config|
  config.include InertiaHelpers, type: :controller
  
  config.before(:each, type: :controller) do
    setup_inertia_test_support
  end
end
