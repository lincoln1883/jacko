# frozen_string_literal: true

require "rails_helper"

RSpec.describe "ClientProfiles", type: :request do
  let(:user) { create(:user, :client) }
  let!(:profile) { create(:client_profile, user: user) }

  before do
    sign_in(user)
  end

  describe "GET /profile/client" do
    it "returns http success" do
      get profile_client_path
      expect(response).to have_http_status(:success)
    end

    it "creates profile if it doesn't exist" do
      user_without_profile = create(:user, :client)
      sign_in(user_without_profile)

      expect {
        get profile_client_path
      }.to change { ClientProfile.count }.by(1)

      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /profile/client/edit" do
    it "returns http success" do
      get edit_profile_client_path
      expect(response).to have_http_status(:success)
    end
  end

  describe "PUT /profile/client" do
    it "updates profile successfully" do
      put profile_client_path, params: {
        client_profile: {
          company_name: "Updated Company",
          description: "Updated description"
        }
      }

      expect(response).to have_http_status(:success)
      profile.reload
      expect(profile.company_name).to eq("Updated Company")
      expect(profile.description).to eq("Updated description")
    end
  end

  describe "authorization" do
    it "redirects suppliers away from client profile" do
      supplier = create(:user, :supplier)
      sign_in(supplier)

      get profile_client_path
      expect(response).to redirect_to(root_path)
    end
  end
end
