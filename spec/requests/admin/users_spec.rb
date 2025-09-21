# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Admin::Users", type: :request do
  let(:admin_user) { create(:user, :admin) }
  before { sign_in admin_user }

  describe "GET /index" do
    it "returns http success" do
      create_list(:user, 3)
      get admin_users_path # Changed to use path helper
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    let!(:user_to_show) { create(:user) }
    it "returns http success" do
      get admin_user_path(user_to_show) # Changed to use path helper
      expect(response).to have_http_status(:success)
    end
  end

  describe "PATCH /update" do # Changed to PATCH
    let!(:user_to_update) { create(:user) }
    context "with valid parameters" do
      it "updates the user" do
        patch admin_user_path(user_to_update), params: {user: {role: "admin"}}
        user_to_update.reload
        expect(user_to_update.role).to eq("admin")
        expect(response).to redirect_to(admin_user_path(user_to_update))
        expect(flash[:notice]).to eq("User updated successfully.")
      end
    end

    context "with invalid parameters" do
      it "does not update the user" do
        patch admin_user_path(user_to_update), params: {user: {role: "invalid_role"}}
        user_to_update.reload
        expect(user_to_update.role).to_not eq("invalid_role")
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end
end
