# frozen_string_literal: true

class SupplierSkill < ApplicationRecord
  belongs_to :supplier_profile
  belongs_to :skill

  # Validations
  validates :supplier_profile, presence: true
  validates :skill, presence: true
  validates :supplier_profile_id, uniqueness: {scope: :skill_id}

  # Scopes
  scope :active_skills, -> { joins(:skill).where(skills: {active: true}) }
  scope :by_category, ->(category) { joins(:skill).where(skills: {category: category}) }
end
