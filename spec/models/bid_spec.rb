# frozen_string_literal: true

require "rails_helper"

RSpec.describe Bid, type: :model do
  subject { build(:bid) }

  describe "associations" do
    it { is_expected.to belong_to(:job) }
    it { is_expected.to belong_to(:supplier_profile) }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:amount) }
    it { is_expected.to validate_numericality_of(:amount).is_greater_than(0) }
    it { is_expected.to validate_length_of(:message).is_at_most(1000) }
    it { is_expected.to validate_presence_of(:status) }
    it { is_expected.to validate_presence_of(:job_id) }
    it { is_expected.to validate_presence_of(:supplier_profile_id) }

    context "uniqueness validation" do
      let!(:existing_bid) { create(:bid, job: create(:job, :open), supplier_profile: create(:supplier_profile)) }

      it "validates that a supplier_profile can only bid once per job" do
        duplicate_bid = build(:bid, job: existing_bid.job, supplier_profile: existing_bid.supplier_profile)
        expect(duplicate_bid).to_not be_valid
        expect(duplicate_bid.errors[:supplier_profile_id]).to include("already placed a bid on this job")
      end
    end
  end

  describe "enums" do
    it { is_expected.to define_enum_for(:status).with_values(pending: 0, accepted: 1, rejected: 2, withdrawn: 3).backed_by_column_of_type(:integer) }
  end
end
