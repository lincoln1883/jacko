# frozen_string_literal: true

require "rails_helper"

RSpec.describe Skill, type: :model do
  # Associations
  describe "associations" do
    it { is_expected.to have_many(:supplier_skills).dependent(:destroy) }
    it { is_expected.to have_many(:supplier_profiles).through(:supplier_skills) }
  end

  # Validations
  describe "validations" do
    subject { build(:skill) }

    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_uniqueness_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_most(100) }
    it { is_expected.to validate_presence_of(:category) }
    it { is_expected.to validate_length_of(:category).is_at_most(50) }
    it { is_expected.to validate_length_of(:description).is_at_most(500) }
    it { is_expected.to validate_inclusion_of(:active).in_array([true, false]) }
  end

  # Scopes
  describe "scopes" do
    let!(:active_skill) { create(:skill, active: true) }
    let!(:inactive_skill) { create(:skill, active: false) }
    let!(:construction_skill) { create(:skill, category: "Construction & Building") }
    let!(:electrical_skill) { create(:skill, :electrical) }

    describe ".active" do
      it "returns only active skills" do
        expect(Skill.active).to include(active_skill)
        expect(Skill.active).not_to include(inactive_skill)
      end
    end

    describe ".by_category" do
      it "returns skills in the specified category" do
        results = Skill.by_category("Electrical & Electronics")
        expect(results).to include(electrical_skill)
        expect(results).not_to include(construction_skill)
      end
    end

    describe ".search" do
      it "finds skills by name" do
        skill = create(:skill, name: "Unique Electrical Wiring")
        expect(Skill.search("Electrical")).to include(skill)
      end

      it "finds skills by description" do
        skill = create(:skill, description: "Professional electrical work")
        expect(Skill.search("electrical")).to include(skill)
      end
    end
  end

  # Constants
  describe "constants" do
    describe "CATEGORIES" do
      it "includes expected Jamaica trade categories" do
        expect(Skill::CATEGORIES).to include(
          "Construction & Building",
          "Electrical & Electronics",
          "Plumbing & HVAC",
          "Automotive & Transportation",
          "Information Technology",
          "Beauty & Personal Care"
        )
      end

      it "is frozen" do
        expect(Skill::CATEGORIES).to be_frozen
      end
    end
  end

  # Class methods
  describe "class methods" do
    describe ".categories" do
      it "returns the CATEGORIES constant" do
        expect(Skill.categories).to eq(Skill::CATEGORIES)
      end
    end

    describe ".by_category_hash" do
      let!(:construction_skill) { create(:skill, category: "Construction & Building") }
      let!(:electrical_skill) { create(:skill, :electrical) }

      it "groups active skills by category" do
        result = Skill.by_category_hash
        expect(result).to be_a(Hash)
        expect(result["Construction & Building"]).to include(construction_skill)
        expect(result["Electrical & Electronics"]).to include(electrical_skill)
      end

      it "excludes inactive skills" do
        inactive_skill = create(:skill, active: false, category: "Construction & Building")
        result = Skill.by_category_hash
        expect(result["Construction & Building"]).not_to include(inactive_skill)
      end
    end
  end

  # Instance methods
  describe "instance methods" do
    let(:skill) { create(:skill, name: "Test Skill") }

    describe "#display_name" do
      it "returns the skill name" do
        expect(skill.display_name).to eq("Test Skill")
      end
    end

    describe "#category_color" do
      it "returns orange for Construction & Building" do
        skill = create(:skill, category: "Construction & Building")
        expect(skill.category_color).to eq("orange")
      end

      it "returns yellow for Electrical & Electronics" do
        skill = create(:skill, category: "Electrical & Electronics")
        expect(skill.category_color).to eq("yellow")
      end

      it "returns blue for Plumbing & HVAC" do
        skill = create(:skill, category: "Plumbing & HVAC")
        expect(skill.category_color).to eq("blue")
      end

      it "returns slate for unknown categories" do
        skill = create(:skill, category: "Unknown Category")
        expect(skill.category_color).to eq("slate")
      end
    end
  end

  # Factory
  describe "factory" do
    it "creates a valid skill" do
      skill = build(:skill)
      expect(skill).to be_valid
    end

    it "creates an electrical skill with trait" do
      skill = create(:skill, :electrical)
      expect(skill.category).to eq("Electrical & Electronics")
      expect(skill.name).to eq("Electrical Wiring")
    end

    it "creates an inactive skill with trait" do
      skill = create(:skill, :inactive)
      expect(skill.active).to be false
    end
  end
end
