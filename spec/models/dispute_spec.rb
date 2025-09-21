# frozen_string_literal: true

require "rails_helper"

RSpec.describe Dispute, type: :model do
  subject { build(:dispute) }

  describe "associations" do
    it { is_expected.to belong_to(:job) }
    it { is_expected.to belong_to(:reporter).class_name("User").with_foreign_key("reporter_id") }
    it { is_expected.to belong_to(:reported_user).class_name("User").with_foreign_key("reported_user_id") }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:reason) }
    it { is_expected.to validate_length_of(:reason).is_at_most(255) }
    it { is_expected.to validate_presence_of(:description) }
    it { is_expected.to validate_length_of(:description).is_at_most(1000) }
    it { is_expected.to validate_presence_of(:status) }
    it { is_expected.to validate_presence_of(:job_id) }
    it { is_expected.to validate_presence_of(:reporter_id) }
    it { is_expected.to validate_presence_of(:reported_user_id) }

    it "validates that reported_user cannot be the same as the reporter" do
      reporter = create(:user)
      dispute = build(:dispute, job: create(:job), reporter: reporter, reported_user: reporter)
      expect(dispute).to_not be_valid
      expect(dispute.errors[:reported_user_id]).to include("cannot be the same as the reporter")
    end

    it "is valid when reported_user is different from reporter" do
      reporter = create(:user, role: :client)
      reported_user = create(:user, role: :supplier)
      dispute = build(:dispute, job: create(:job), reporter: reporter, reported_user: reported_user)
      expect(dispute).to be_valid
    end
  end

  describe "enums" do
    it { is_expected.to define_enum_for(:status).with_values(pending: 0, resolved: 1, escalated: 2).backed_by_column_of_type(:integer) }
  end
end
