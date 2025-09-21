# frozen_string_literal: true

require "rails_helper"

RSpec.describe Job, type: :model do
  subject { build(:job) }

  describe "associations" do
    it { is_expected.to belong_to(:parish) }
    it { is_expected.to belong_to(:client).class_name("User").with_foreign_key("client_id") }
    it { is_expected.to belong_to(:supplier_profile).optional(true) }
    it { is_expected.to have_many(:bids).dependent(:destroy) }
    it { is_expected.to have_many(:reviews).dependent(:destroy) }
    it { is_expected.to have_many(:disputes).dependent(:destroy) }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_length_of(:title).is_at_most(255) }
    it { is_expected.to validate_presence_of(:description) }
    it { is_expected.to validate_length_of(:description).is_at_most(5000) }
    it { is_expected.to validate_presence_of(:budget) }
    it { is_expected.to validate_numericality_of(:budget).is_greater_than(0) }
    it { is_expected.to validate_presence_of(:due_date) }
    it { is_expected.to validate_presence_of(:location) }
    it { is_expected.to validate_length_of(:location).is_at_most(255) }
    it { is_expected.to validate_presence_of(:status) }
    it { is_expected.to validate_presence_of(:client_id) }
    it { is_expected.to validate_presence_of(:parish_id) }

    context "when status is bidding" do
      subject { build(:job, status: :bidding) }
      it { is_expected.to validate_presence_of(:supplier_profile_id) }
    end

    context "when status is not bidding" do
      subject { build(:job, status: :open, supplier_profile_id: nil) }
      it { is_expected.not_to validate_presence_of(:supplier_profile_id) }
    end
  end

  describe "enums" do
    it { is_expected.to define_enum_for(:status).with_values(open: 0, bidding: 1, in_progress: 2, completed: 3, cancelled: 4).backed_by_column_of_type(:integer) }
  end

  describe "scopes" do
    let!(:open_job) { create(:job, status: :open) }
    let!(:bidding_job) { create(:job, status: :bidding, supplier_profile: create(:supplier_profile)) }
    let!(:in_progress_job) { create(:job, status: :in_progress, supplier_profile: create(:supplier_profile)) }
    let!(:completed_job) { create(:job, status: :completed, supplier_profile: create(:supplier_profile)) }
    let!(:cancelled_job) { create(:job, status: :cancelled) }
    let!(:client_user) { create(:user, :client) }
    let!(:job_for_client) { create(:job, client: client_user) }
    let!(:parish) { create(:parish) }
    let!(:job_by_parish) { create(:job, parish: parish) }

    describe ".active" do
      it "returns jobs with open, bidding, or in_progress status" do
        expect(Job.active).to include(open_job, bidding_job, in_progress_job)
        expect(Job.active).to_not include(completed_job, cancelled_job)
      end
    end

    describe ".for_client" do
      it "returns jobs for a specific client" do
        expect(Job.for_client(client_user.id)).to include(job_for_client)
        expect(Job.for_client(client_user.id)).to_not include(open_job)
      end
    end

    describe ".by_parish" do
      it "returns jobs for a specific parish" do
        expect(Job.by_parish(parish.id)).to include(job_by_parish)
        expect(Job.by_parish(parish.id)).to_not include(open_job)
      end
    end

    describe ".open_for_bidding" do
      it "returns jobs with open status" do
        expect(Job.open_for_bidding).to include(open_job)
        expect(Job.open_for_bidding).to_not include(bidding_job, in_progress_job, completed_job, cancelled_job)
      end
    end
  end
end
