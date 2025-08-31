# frozen_string_literal: true

require "rails_helper"

RSpec.describe ClientProfile, type: :model do
  let(:user) { create(:user, :client) }
  let(:profile) { build(:client_profile, user: user) }

  describe "associations" do
    it { should belong_to(:user) }
  end

  describe "validations" do
    it { should validate_presence_of(:user) }
    it { should validate_presence_of(:preferred_contact_method) }

    it "validates uniqueness of user" do
      create(:client_profile, user: user)
      duplicate_profile = build(:client_profile, user: user)
      expect(duplicate_profile).not_to be_valid
      expect(duplicate_profile.errors[:user]).to include("has already been taken")
    end

    it { should validate_length_of(:company_name).is_at_most(255) }
    it { should validate_length_of(:description).is_at_most(1500) }

    describe "project_budget_range validation" do
      it "allows valid budget ranges" do
        valid_ranges = %w[under_500 500_1000 1000_2500 2500_5000 5000_10000 over_10000]

        valid_ranges.each do |range|
          profile.project_budget_range = range
          expect(profile).to be_valid, "#{range} should be valid"
        end
      end

      it "rejects invalid budget ranges" do
        profile.project_budget_range = "invalid_range"
        expect(profile).not_to be_valid
        expect(profile.errors[:project_budget_range]).to include("must be a valid budget range")
      end

      it "allows nil budget range" do
        profile.project_budget_range = nil
        expect(profile).to be_valid
      end
    end
  end

  describe "enums" do
    it "defines preferred_contact_method enum" do
      expect(ClientProfile.preferred_contact_methods).to eq({
        "email" => 0,
        "phone" => 1,
        "whatsapp" => 2,
        "platform_messaging" => 3
      })
    end
  end

  describe "scopes" do
    before do
      create(:client_profile, :completed, project_budget_range: "1000_2500")
      create(:client_profile, :incomplete, project_budget_range: "over_10000")
      create(:client_profile, active: false)
    end

    describe ".active" do
      it "returns only active profiles" do
        expect(ClientProfile.active.count).to eq(2)
      end
    end

    describe ".completed" do
      it "returns only completed profiles" do
        expect(ClientProfile.completed.count).to eq(1)
      end
    end

    describe ".with_budget_range" do
      it "returns profiles with specified budget range" do
        expect(ClientProfile.with_budget_range("over_10000").count).to eq(1)
      end
    end
  end

  describe "#completed?" do
    it "returns true when profile is completed" do
      profile = create(:client_profile, :completed)
      expect(profile.completed?).to be true
    end

    it "returns false when profile is incomplete" do
      profile = create(:client_profile, :incomplete)
      expect(profile.completed?).to be false
    end
  end

  describe "#completion_percentage" do
    it "calculates completion percentage correctly" do
      profile = create(:client_profile,
        description: "Test description",
        company_name: "Test Company",
        project_budget_range: "1000_2500"
      )

      # 3 out of 3 fields completed = 100%
      expect(profile.completion_percentage).to eq(100)
    end

    it "calculates partial completion correctly" do
      profile = create(:client_profile,
        description: "Test description",
        company_name: nil,
        project_budget_range: nil
      )

      # 1 out of 3 fields completed = 33%
      expect(profile.completion_percentage).to eq(33)
    end
  end

  describe "#mark_as_completed!" do
    it "sets profile_completed_at when profile is complete" do
      profile = create(:client_profile, :completed)
      profile.update!(profile_completed_at: nil)

      expect { profile.mark_as_completed! }.to change { profile.profile_completed_at }.from(nil)
    end

    it "does not set profile_completed_at when profile is incomplete" do
      profile = create(:client_profile, :incomplete)

      expect { profile.mark_as_completed! }.not_to change { profile.profile_completed_at }
    end
  end

  describe "display methods" do
    describe "#display_budget_range" do
      it "formats budget ranges correctly" do
        test_cases = {
          "under_500" => "Under $500",
          "500_1000" => "$500 - $1,000",
          "1000_2500" => "$1,000 - $2,500",
          "2500_5000" => "$2,500 - $5,000",
          "5000_10000" => "$5,000 - $10,000",
          "over_10000" => "Over $10,000"
        }

        test_cases.each do |range, expected_display|
          profile.project_budget_range = range
          expect(profile.display_budget_range).to eq(expected_display)
        end
      end

      it "returns message for blank budget range" do
        profile.project_budget_range = nil
        expect(profile.display_budget_range).to eq("Budget not specified")
      end
    end

    describe "#display_contact_method" do
      it "formats contact methods correctly" do
        test_cases = {
          "email" => "Email",
          "phone" => "Phone call",
          "whatsapp" => "WhatsApp",
          "platform_messaging" => "Platform messaging"
        }

        test_cases.each do |method, expected_display|
          profile.preferred_contact_method = method
          expect(profile.display_contact_method).to eq(expected_display)
        end
      end
    end
  end

  describe "class methods" do
    describe ".budget_range_options" do
      it "returns correct budget range options" do
        expected_options = [
          ["Under $500", "under_500"],
          ["$500 - $1,000", "500_1000"],
          ["$1,000 - $2,500", "1000_2500"],
          ["$2,500 - $5,000", "2500_5000"],
          ["$5,000 - $10,000", "5000_10000"],
          ["Over $10,000", "over_10000"]
        ]

        expect(ClientProfile.budget_range_options).to eq(expected_options)
      end
    end

    describe ".contact_method_options" do
      it "returns correct contact method options" do
        expected_options = [
          ["Platform messaging", "platform_messaging"],
          ["Email", "email"],
          ["Phone call", "phone"],
          ["WhatsApp", "whatsapp"]
        ]

        expect(ClientProfile.contact_method_options).to eq(expected_options)
      end
    end
  end
end
