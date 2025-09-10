# frozen_string_literal: true

require "rails_helper"

RSpec.describe "PortfolioImages", type: :request do
  let(:user) { create(:user, :tradesperson) }
  let!(:profile) { create(:trades_person_profile, user: user) }
  let(:portfolio_image) { create(:portfolio_image, trades_person_profile: profile) }

  before do
    sign_in user
  end

  describe "GET /portfolio_images" do
    it "returns portfolio images for authenticated tradesperson" do
      get "/portfolio_images"
      expect(response).to have_http_status(:success)
      expect(response.content_type).to match(a_string_including("application/json"))
    end
  end

  describe "POST /portfolio_images" do
    let(:image_file) { fixture_file_upload("spec/fixtures/test_image.jpg", "image/jpeg") }

    it "creates a portfolio image" do
      expect {
        post "/portfolio_images", params: {
          portfolio_image: {
            image: image_file,
            title: "Test Image",
            description: "Test Description"
          }
        }
      }.to change(PortfolioImage, :count).by(1)

      expect(response).to have_http_status(:created)
    end
  end

  describe "GET /portfolio_images/:id" do
    it "returns portfolio image details" do
      get "/portfolio_images/#{portfolio_image.id}"
      expect(response).to have_http_status(:success)
      expect(response.content_type).to match(a_string_including("application/json"))
    end
  end

  describe "PATCH /portfolio_images/:id" do
    it "updates portfolio image" do
      patch "/portfolio_images/#{portfolio_image.id}", params: {
        portfolio_image: {
          title: "Updated Title"
        }
      }
      expect(response).to have_http_status(:success)
    end
  end

  describe "DELETE /portfolio_images/:id" do
    it "deletes portfolio image" do
      portfolio_image # create the image
      expect {
        delete "/portfolio_images/#{portfolio_image.id}"
      }.to change(PortfolioImage, :count).by(-1)

      expect(response).to have_http_status(:success)
    end
  end
end
