# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Health Check", type: :request do
  describe "GET /up" do
    it "returns a successful response" do
      get "/up"

      expect(response).to have_http_status(:ok)
      expect(response.body).to include("green")
    end

    it "responds quickly" do
      start_time = Time.current
      get "/up"
      end_time = Time.current

      expect(end_time - start_time).to be < 1.second
    end
  end
end
