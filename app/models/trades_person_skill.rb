# frozen_string_literal: true

class TradesPersonSkill < ApplicationRecord
  belongs_to :trades_person_profile
  belongs_to :skill

  # Validations
  validates :trades_person_profile, presence: true
  validates :skill, presence: true
  validates :trades_person_profile_id, uniqueness: {scope: :skill_id}

  # Scopes
  scope :active_skills, -> { joins(:skill).where(skills: {active: true}) }
  scope :by_category, ->(category) { joins(:skill).where(skills: {category: category}) }
end
