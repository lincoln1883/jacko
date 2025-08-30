# frozen_string_literal: true

require "rails_helper"

RSpec.describe "TradesPersonProfiles", type: :request do
  let(:user) { create(:user, :tradesperson) }
  let!(:profile) { create(:trades_person_profile, user: user) }

  before do
    sign_in(user)
  end

  describe "GET /profile/tradesperson" do
    it "returns http success" do
      get profile_tradesperson_path
      expect(response).to have_http_status(:success)
    end

    it "creates profile if it doesn't exist" do
      user_without_profile = create(:user, :tradesperson)
      sign_in(user_without_profile)

      expect {
        get profile_tradesperson_path
      }.to change { TradesPersonProfile.count }.by(1)

      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /profile/tradesperson/edit" do
    it "returns http success" do
      get edit_profile_tradesperson_path
      expect(response).to have_http_status(:success)
    end
  end

  describe "PUT /profile/tradesperson" do
    it "updates profile successfully" do
      put profile_tradesperson_path, params: {
        trades_person_profile: {
          bio: "Updated bio",
          company_name: "Updated Company"
        }
      }

      expect(response).to have_http_status(:success)
      profile.reload
      expect(profile.bio).to eq("Updated bio")
      expect(profile.company_name).to eq("Updated Company")
    end
  end

  describe "authorization" do
    it "redirects clients away from tradesperson profile" do
      client = create(:user, :client)
      sign_in(client)

      get profile_tradesperson_path
      expect(response).to redirect_to(root_path)
    end
  end
end
