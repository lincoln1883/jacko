# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Reviews", type: :request do
  let(:client_user) { create(:user, :client) }
  let!(:job) { create(:job, :with_supplier, :completed, client: client_user) }
  let!(:accepted_bid) { create(:bid, :accepted, job: job, supplier_profile: job.supplier_profile) } # Create an accepted bid
  before { sign_in client_user }

  describe "GET /new" do
    it "returns http success" do
      get new_job_review_path(job)
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Review" do
        expect do
          post job_reviews_path(job), params: {review: {rating: 5, comment: "Great work!", reviewed_user_id: job.supplier_profile.user.id}}
        end.to change(Review, :count).by(1)
        expect(response).to redirect_to(job_path(job))
        expect(flash[:notice]).to eq("Review submitted successfully!")
      end
    end

    context "with invalid parameters" do
      it "does not create a Review" do
        expect do
          post job_reviews_path(job), params: {review: {rating: nil, comment: ""}}
        end.to_not change(Review, :count)
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end
end
