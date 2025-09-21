# frozen_string_literal: true

require "rails_helper"
require "cgi"

RSpec.describe "Admin::VerificationRequests", type: :request do
  let(:admin_user) { create(:user, :admin) }
  before { sign_in admin_user }

  describe "GET /index" do
    it "returns http success" do
      create_list(:verification_request, 3) # Create some verification requests for index
      get admin_verification_requests_path
      expect(response).to have_http_status(:success)

      json_response = JSON.parse(CGI.unescapeHTML(response.body.match(/<div id="app" data-page="(.*)"><\/div>/)[1]))
      verification_requests_props = json_response["props"]["verificationRequests"]

      expect(verification_requests_props.map { |vr| vr["id"] }).to include(VerificationRequest.first.id)
    end
  end

  describe "GET /show" do
    let!(:verification_request) { create(:verification_request) }
    it "returns http success" do
      get admin_verification_request_path(verification_request)
      expect(response).to have_http_status(:success)

      json_response = JSON.parse(CGI.unescapeHTML(response.body.match(/<div id="app" data-page="(.*)"><\/div>/)[1]))
      verification_request_props = json_response["props"]["verificationRequest"]
      expect(verification_request_props["id"]).to eq(verification_request.id)
    end
  end

  describe "PATCH /update" do
    let!(:verification_request) { create(:verification_request) }
    context "with valid parameters" do
      it "updates the verification request status" do
        patch admin_verification_request_path(verification_request), params: {verification_request: {status: "approved"}}
        verification_request.reload
        expect(verification_request.status).to eq("approved")
        expect(verification_request.supplier.reload.verified).to be true
        expect(response).to redirect_to(admin_verification_request_path(verification_request))
        expect(flash[:notice]).to eq("Verification request approved and supplier marked as verified!")
      end

      it "rejects the verification request and unverified the supplier if no other approved requests exist" do
        verification_request.update(status: :approved)
        verification_request.supplier.update(verified: true)

        patch admin_verification_request_path(verification_request), params: {verification_request: {status: "rejected"}}
        verification_request.reload
        expect(verification_request.status).to eq("rejected")
        expect(verification_request.supplier.reload.verified).to be false
        expect(response).to redirect_to(admin_verification_request_path(verification_request))
        expect(flash[:notice]).to eq("Verification request rejected!")
      end
    end

    context "with invalid parameters" do
      it "does not update the verification request" do
        patch admin_verification_request_path(verification_request), params: {verification_request: {status: "invalid_status"}}
        verification_request.reload
        expect(verification_request.status).to_not eq("invalid_status")
        expect(response).to redirect_to(admin_verification_request_path(verification_request))
        expect(flash[:alert]).to eq("Failed to update verification request.")
      end
    end
  end
end
