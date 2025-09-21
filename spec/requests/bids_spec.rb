# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Bids", type: :request do
  let(:supplier_user) { create(:user, :supplier) }
  let!(:supplier_profile) { create(:supplier_profile, user: supplier_user) }
  let(:client_user) { create(:user, :client) }
  let!(:job) { create(:job, :open, :with_supplier, client: client_user) } # Set status to :open and add :with_supplier
  before { sign_in supplier_user }

  describe "GET /new" do
    it "returns http success" do
      get new_job_bid_path(job)
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Bid" do
        expect do
          post job_bids_path(job), params: {bid: {amount: 1500, message: "I am interested", supplier_profile_id: supplier_profile.id}}
        end.to change(Bid, :count).by(1)
        expect(response).to redirect_to(job_path(job))
        expect(flash[:notice]).to eq("Your bid has been placed successfully!")
      end
    end

    context "with invalid parameters" do
      it "does not create a Bid" do
        expect do
          post job_bids_path(job), params: {bid: {amount: nil, message: ""}}
        end.to_not change(Bid, :count)
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end
end
