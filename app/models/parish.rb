# frozen_string_literal: true

class Parish < ApplicationRecord
  # Associations
  has_many :trades_person_profiles, dependent: :destroy

  # Validations
  validates :name, presence: true, uniqueness: true
  validates :code, presence: true, uniqueness: true, length: {maximum: 3}
  validates :active, inclusion: {in: [true, false]}
  validates :svg_path, :color, length: {maximum: 255}, allow_nil: true

  # Scopes
  scope :active, -> { where(active: true) }

  def display_name
    name
  end
end
