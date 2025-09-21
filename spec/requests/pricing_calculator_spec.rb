# frozen_string_literal: true

require "rails_helper"

RSpec.describe "PricingCalculators", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get pricing_calculator_path
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /calculate" do
    let!(:construction_service) { create(:construction_service, price: 50) }

    it "returns http success with total cost" do
      post calculate_pricing_calculator_path, params: {selected_services: [{id: construction_service.id, quantity: 2}]}
      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)
      expect(json_response["totalCost"]).to eq("100.0") # Expected string value
    end

    it "returns unprocessable_content with errors for invalid parameters" do
      post calculate_pricing_calculator_path, params: {selected_services: [{id: construction_service.id, quantity: 0}]}
      expect(response).to have_http_status(:unprocessable_content)
      json_response = JSON.parse(response.body)
      expect(json_response["errors"]).to_not be_empty
    end
  end
end
