# frozen_string_literal: true

require "rails_helper"
include ActionDispatch::TestProcess # Required for fixture_file_upload

RSpec.describe "VerificationRequests", type: :request do
  let(:supplier_user) { create(:user, :supplier) }
  before { sign_in supplier_user }

  describe "GET /new" do
    it "returns http success" do
      get new_verification_request_path
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new VerificationRequest" do
        expect do
          post verification_requests_path, params: {verification_request: {notes: "Some notes", documents: [fixture_file_upload("test_document.pdf", "application/pdf")]}}
        end.to change(VerificationRequest, :count).by(1)
        expect(response).to redirect_to(verification_request_path(VerificationRequest.last))
        expect(flash[:notice]).to eq("Verification request submitted successfully!")
      end
    end

    context "with invalid parameters" do
      it "does not create a VerificationRequest" do
        expect do
          post verification_requests_path, params: {verification_request: {notes: nil, documents: []}}
        end.to_not change(VerificationRequest, :count)
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end

  describe "GET /show" do
    let!(:verification_request) { create(:verification_request, supplier: supplier_user) }
    it "returns http success" do
      get verification_request_path(verification_request)
      expect(response).to have_http_status(:success)
    end
  end
end
