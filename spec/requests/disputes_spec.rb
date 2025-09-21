# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Disputes", type: :request do
  let(:client_user) { create(:user, :client) }
  let!(:job) { create(:job, :with_supplier, :completed, client: client_user) } # Add :completed trait
  before { sign_in client_user }

  describe "GET /new" do
    it "returns http success" do
      get new_job_dispute_path(job)
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Dispute" do
        expect do
          post job_disputes_path(job), params: {dispute: {reason: "Job not completed as agreed", description: "The supplier did not finish the work. ", reported_user_id: job.supplier_profile.user.id, status: "pending"}}
        end.to change(Dispute, :count).by(1)
        expect(response).to redirect_to(job_path(job))
        expect(flash[:notice]).to eq("Dispute reported successfully!")
      end
    end

    context "with invalid parameters" do
      it "does not create a Dispute" do
        expect do
          post job_disputes_path(job), params: {dispute: {reason: "", description: ""}}
        end.to_not change(Dispute, :count)
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end
end
