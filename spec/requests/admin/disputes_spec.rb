# frozen_string_literal: true

require "rails_helper"
require "cgi"

RSpec.describe "Admin::Disputes", type: :request do
  let(:admin_user) { create(:user, :admin) }
  before { sign_in admin_user }

  describe "GET /index" do
    it "returns http success" do
      create_list(:dispute, 3, job: create(:job, :with_supplier))
      get admin_disputes_path
      expect(response).to have_http_status(:success)

      json_response = JSON.parse(CGI.unescapeHTML(response.body.match(/<div id="app" data-page="(.*)"><\/div>/)[1]))
      disputes_props = json_response["props"]["disputes"]

      expect(disputes_props.map { |d| d["id"] }).to include(Dispute.first.id)
    end
  end

  describe "GET /show" do
    let!(:dispute) { create(:dispute, job: create(:job, :with_supplier)) }
    it "returns http success" do
      get admin_dispute_path(dispute)
      expect(response).to have_http_status(:success)

      json_response = JSON.parse(CGI.unescapeHTML(response.body.match(/<div id="app" data-page="(.*)"><\/div>/)[1]))
      dispute_props = json_response["props"]["dispute"]
      expect(dispute_props["id"]).to eq(dispute.id)
    end
  end

  describe "PATCH /update" do
    let!(:dispute) { create(:dispute, job: create(:job, :with_supplier)) }
    context "with valid parameters" do
      it "updates the dispute status" do
        patch admin_dispute_path(dispute), params: {dispute: {status: "resolved"}}
        dispute.reload
        expect(dispute.status).to eq("resolved")
        expect(response).to redirect_to(admin_dispute_path(dispute))
        expect(flash[:notice]).to eq("Dispute status updated successfully!")
      end
    end

    context "with invalid parameters" do
      it "does not update the dispute" do
        patch admin_dispute_path(dispute), params: {dispute: {status: "invalid_status"}}
        dispute.reload
        expect(dispute.status).to_not eq("invalid_status")
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end
end
