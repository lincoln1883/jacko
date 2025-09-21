# frozen_string_literal: true

require "rails_helper"

RSpec.describe SupplierProfile, type: :model do
  let(:user) { create(:user, :supplier) }
  let(:profile) { build(:supplier_profile, user: user) }

  describe "associations" do
    it { should belong_to(:user) }
  end

  describe "validations" do
    it { should validate_presence_of(:user) }

    it "validates uniqueness of user" do
      create(:supplier_profile, user: user)
      duplicate_profile = build(:supplier_profile, user: user)
      expect(duplicate_profile).not_to be_valid
      expect(duplicate_profile.errors[:user]).to include("has already been taken")
    end

    it { should validate_length_of(:bio).is_at_most(1000) }
    it { should validate_length_of(:company_name).is_at_most(255) }
    it { should validate_length_of(:description).is_at_most(2000) }
    it { should validate_presence_of(:availability_status) }

    describe "years_experience validation" do
      it "allows nil values" do
        profile.years_experience = nil
        expect(profile).to be_valid
      end

      it "allows values between 0 and 50" do
        profile.years_experience = 25
        expect(profile).to be_valid
      end

      it "rejects negative values" do
        profile.years_experience = -1
        expect(profile).not_to be_valid
      end

      it "rejects values over 50" do
        profile.years_experience = 51
        expect(profile).not_to be_valid
      end
    end

    describe "hourly_rate validation" do
      it "allows nil values" do
        profile.hourly_rate = nil
        expect(profile).to be_valid
      end

      it "allows positive values" do
        profile.hourly_rate = 50.00
        expect(profile).to be_valid
      end

      it "rejects zero or negative values" do
        profile.hourly_rate = 0
        expect(profile).not_to be_valid
      end

      it "rejects extremely high values" do
        profile.hourly_rate = 10001
        expect(profile).not_to be_valid
      end
    end

    describe "phone validation" do
      it "allows valid phone formats" do
        valid_phones = [
          "+1-876-123-4567",
          "876 123 4567",
          "(876) 123-4567",
          "8761234567"
        ]

        valid_phones.each do |phone|
          profile.phone = phone
          expect(profile).to be_valid, "#{phone} should be valid"
        end
      end

      it "rejects invalid phone formats" do
        profile.phone = "not-a-phone"
        expect(profile).not_to be_valid
      end

      it "allows blank phone" do
        profile.phone = ""
        expect(profile).to be_valid
      end
    end

    describe "website validation" do
      it "allows valid URLs" do
        valid_urls = [
          "https://example.com",
          "http://example.com",
          "https://www.example.com/path"
        ]

        valid_urls.each do |url|
          profile.website = url
          expect(profile).to be_valid, "#{url} should be valid"
        end
      end

      it "rejects invalid URLs" do
        profile.website = "not-a-url"
        expect(profile).not_to be_valid
      end

      it "allows blank website" do
        profile.website = ""
        expect(profile).to be_valid
      end
    end
  end

  describe "enums" do
    it "defines availability_status enum" do
      expect(SupplierProfile.availability_statuses).to eq({
        "is_available" => 0,
        "busy" => 1,
        "unavailable" => 2,
        "booked" => 3
      })
    end

    it "defines experience_level enum" do
      expect(SupplierProfile.experience_levels).to eq({
        "graduate" => 0,
        "intermediate" => 1,
        "expert" => 2,
        "master" => 3
      })
    end
  end

  describe "scopes" do
    before do
      create(:supplier_profile, :completed, availability_status: :is_available, years_experience: 5)
      create(:supplier_profile, :incomplete, availability_status: :busy, years_experience: 10)
      create(:supplier_profile, availability_status: :unavailable, active: false, years_experience: 2)
    end

    describe ".active" do
      it "returns only active profiles" do
        expect(SupplierProfile.active.count).to eq(2)
      end
    end

    describe ".available" do
      it "returns only available profiles" do
        expect(SupplierProfile.available.count).to eq(1)
      end
    end

    describe ".completed" do
      it "returns only completed profiles" do
        expect(SupplierProfile.completed.count).to eq(1)
      end
    end

    describe ".with_experience" do
      it "returns profiles with at least the specified experience" do
        expect(SupplierProfile.with_experience(8).count).to eq(1)
      end
    end
  end

  describe "#completed?" do
    it "returns true when profile is completed" do
      profile = create(:supplier_profile, :completed)
      expect(profile.completed?).to be true
    end

    it "returns false when profile is incomplete" do
      profile = create(:supplier_profile, :incomplete)
      expect(profile.completed?).to be false
    end
  end

  describe "#completion_percentage" do
    it "calculates completion percentage correctly" do
      skill = create(:skill)
      profile = create(:supplier_profile,
        bio: "Test bio",
        description: "Test description",
        years_experience: 5,
        hourly_rate: 50.00,
        phone: "876-123-4567",
        company_name: nil,
        experience_level: :intermediate
      )
      profile.skills << skill

      # 7 out of 10 fields completed = 70% (before location fields)
      # With location fields: 10 out of 13 fields completed = 76.92 -> 77%
      expect(profile.completion_percentage).to eq(77)
    end
  end

  describe "#mark_as_completed!" do
    it "sets profile_completed_at when profile is complete" do
      skill = create(:skill)
      profile = create(:supplier_profile, :completed)
      profile.skills << skill
      profile.update!(profile_completed_at: nil)

      expect { profile.mark_as_completed! }.to change { profile.profile_completed_at }.from(nil)
    end

    it "does not set profile_completed_at when profile is incomplete" do
      profile = create(:supplier_profile, :incomplete)
      profile.update!(experience_level: :intermediate) # Ensure experience_level is set for incomplete profile

      expect { profile.mark_as_completed! }.not_to change { profile.profile_completed_at }
    end
  end

  describe "display methods" do
    let(:profile) { create(:supplier_profile, hourly_rate: 75.50, years_experience: 10) }

    describe "#display_hourly_rate" do
      it "formats hourly rate correctly" do
        expect(profile.display_hourly_rate).to eq("$75.5/hr")
      end

      it "returns message for blank rate" do
        profile.hourly_rate = nil
        expect(profile.display_hourly_rate).to eq("Rate not specified")
      end
    end

    describe "#display_experience" do
      it "formats years of experience correctly" do
        expect(profile.display_experience).to eq("10 years experience")
      end

      it "handles singular year" do
        profile.years_experience = 1
        expect(profile.display_experience).to eq("1 year experience")
      end

      it "handles entry level" do
        profile.years_experience = 0
        expect(profile.display_experience).to eq("Entry level")
      end

      it "handles blank experience" do
        profile.years_experience = nil
        expect(profile.display_experience).to eq("No experience specified")
      end
    end

    describe "#display_availability" do
      it "returns correct availability text" do
        profile.availability_status = :is_available
        expect(profile.display_availability).to eq("Available")
      end
    end

    describe "#availability_color" do
      it "returns correct color for available status" do
        profile.availability_status = :is_available
        expect(profile.availability_color).to eq("green")
      end

      it "returns correct color for busy status" do
        profile.availability_status = :busy
        expect(profile.availability_color).to eq("yellow")
      end

      it "returns correct color for unavailable status" do
        profile.availability_status = :unavailable
        expect(profile.availability_color).to eq("red")
      end
    end
  end

  describe "search scopes" do
    let(:profile1) do
      create(:supplier_profile,
        bio: "Expert plumber with 10 years experience",
        company_name: "ABC Plumbing",
        description: "Residential and commercial plumbing services"
      )
    end

    let(:profile2) do
      create(:supplier_profile,
        bio: "Professional electrician",
        company_name: "XYZ Electric",
        description: "Home wiring and electrical repairs"
      )
    end

    describe ".search_by_text" do
      it "finds profiles by bio content" do
        results = described_class.search_by_text("plumber")
        expect(results).to include(profile1)
        expect(results).not_to include(profile2)
      end

      it "finds profiles by company name" do
        results = described_class.search_by_text("ABC")
        expect(results).to include(profile1)
        expect(results).not_to include(profile2)
      end

      it "finds profiles by description" do
        results = described_class.search_by_text("commercial")
        expect(results).to include(profile1)
        expect(results).not_to include(profile2)
      end

      it "is case insensitive" do
        results = described_class.search_by_text("PLUMBER")
        expect(results).to include(profile1)
      end

      it "handles partial matches" do
        results = described_class.search_by_text("plumb")
        expect(results).to include(profile1)
      end

      it "returns empty when no matches found" do
        results = described_class.search_by_text("nonexistent")
        expect(results).to be_empty
      end
    end
  end
end
