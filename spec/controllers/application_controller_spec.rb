# frozen_string_literal: true

require "rails_helper"

RSpec.describe ApplicationController, type: :controller do
  describe "browser version support" do
    it "inherits from ActionController::Base" do
      expect(ApplicationController.superclass).to eq(ActionController::Base)
    end

    it "has allow_browser configuration" do
      # Test that the controller has allow_browser callbacks configured
      # In Rails 8, this creates before_action callbacks including a lambda
      callback_filters = ApplicationController._process_action_callbacks.map(&:filter)
      expect(callback_filters).to include(a_kind_of(Proc))
    end
  end
end
