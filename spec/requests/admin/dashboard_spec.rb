# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Admin::Dashboards", type: :request do
  let(:admin_user) { create(:user, :admin) }
  before { sign_in admin_user }

  describe "GET /index" do
    it "returns http success" do
      get admin_dashboard_path
      expect(response).to have_http_status(:success)
    end
  end
end
