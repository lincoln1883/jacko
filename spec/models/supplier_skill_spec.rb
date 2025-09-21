# frozen_string_literal: true

require "rails_helper"

RSpec.describe SupplierSkill, type: :model do
  # Associations
  describe "associations" do
    it { is_expected.to belong_to(:supplier_profile) }
    it { is_expected.to belong_to(:skill) }
  end

  # Validations
  describe "validations" do
    subject { build(:supplier_skill) }

    it { is_expected.to validate_presence_of(:supplier_profile) }
    it { is_expected.to validate_presence_of(:skill) }
    it { is_expected.to validate_uniqueness_of(:supplier_profile_id).scoped_to(:skill_id) }
  end

  # Scopes
  describe "scopes" do
    let(:profile) { create(:supplier_profile) }
    let(:active_skill) { create(:skill, active: true) }
    let(:inactive_skill) { create(:skill, active: false) }
    let(:construction_skill) { create(:skill, category: "Construction & Building") }
    let(:electrical_skill) { create(:skill, category: "Electrical & Electronics") }

    let!(:active_profile_skill) { create(:supplier_skill, supplier_profile: profile, skill: active_skill) }
    let!(:inactive_profile_skill) { create(:supplier_skill, supplier_profile: profile, skill: inactive_skill) }
    let!(:construction_profile_skill) { create(:supplier_skill, supplier_profile: profile, skill: construction_skill) }
    let!(:electrical_profile_skill) { create(:supplier_skill, supplier_profile: profile, skill: electrical_skill) }

    describe ".active_skills" do
      it "returns only profile skills with active skills" do
        results = profile.supplier_skills.active_skills
        expect(results).to include(active_profile_skill)
        expect(results).not_to include(inactive_profile_skill)
      end
    end

    describe ".by_category" do
      it "returns profile skills in the specified category" do
        results = profile.supplier_skills.by_category("Electrical & Electronics")
        expect(results).to include(electrical_profile_skill)
        expect(results).not_to include(construction_profile_skill)
      end
    end
  end

  # Factory
  describe "factory" do
    it "creates a valid trades person skill association" do
      supplier_skill = build(:supplier_skill)
      expect(supplier_skill).to be_valid
    end

    it "prevents duplicate skill assignments" do
      profile = create(:supplier_profile)
      skill = create(:skill)

      create(:supplier_skill, supplier_profile: profile, skill: skill)

      duplicate = build(:supplier_skill, supplier_profile: profile, skill: skill)
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:supplier_profile_id]).to include("has already been taken")
    end
  end

  # Database constraints
  describe "database constraints" do
    it "enforces unique constraint and validates at model level" do
      profile = create(:supplier_profile)
      skill = create(:skill)

      create(:supplier_skill, supplier_profile: profile, skill: skill)

      # Rails validation catches it before hitting the database
      expect {
        SupplierSkill.create!(
          supplier_profile_id: profile.id,
          skill_id: skill.id
        )
      }.to raise_error(ActiveRecord::RecordInvalid, /has already been taken/)
    end
  end
end
