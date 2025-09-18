# frozen_string_literal: true

class Skill < ApplicationRecord
  # Associations
  has_many :trades_person_skills, dependent: :destroy
  has_many :trades_person_profiles, through: :trades_person_skills

  # Validations
  validates :name, presence: true, uniqueness: true, length: {maximum: 100}
  validates :category, presence: true, length: {maximum: 50}
  validates :description, length: {maximum: 500}
  validates :active, inclusion: {in: [true, false]}

  # Scopes
  scope :active, -> { where(active: true) }
  scope :by_category, ->(category) { where(category: category) }
  scope :search, ->(query) { where("name LIKE ? OR description LIKE ?", "%#{query}%", "%#{query}%") }

  # Category constants based on Jamaica trade sectors
  CATEGORIES = [
    "Construction & Building",
    "Electrical & Electronics",
    "Plumbing & HVAC",
    "Automotive & Transportation",
    "Information Technology",
    "Beauty & Personal Care",
    "Food Service & Hospitality",
    "Agriculture & Landscaping",
    "Home Services & Maintenance",
    "Manufacturing & Craft",
    "Health & Wellness",
    "Creative & Media"
  ].freeze

  # Helper methods
  def self.categories
    CATEGORIES
  end

  def self.by_category_hash
    active.group_by(&:category)
  end

  def display_name
    name
  end

  def category_color
    case category
    when "Construction & Building"
      "orange"
    when "Electrical & Electronics"
      "yellow"
    when "Plumbing & HVAC"
      "blue"
    when "Automotive & Transportation"
      "red"
    when "Information Technology"
      "purple"
    when "Beauty & Personal Care"
      "pink"
    when "Food Service & Hospitality"
      "green"
    when "Agriculture & Landscaping"
      "emerald"
    when "Home Services & Maintenance"
      "gray"
    when "Manufacturing & Craft"
      "amber"
    when "Health & Wellness"
      "cyan"
    when "Creative & Media"
      "indigo"
    else
      "slate"
    end
  end
end
