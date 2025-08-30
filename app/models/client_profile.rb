# frozen_string_literal: true

class ClientProfile < ApplicationRecord
  belongs_to :user

  # Contact method enum
  enum :preferred_contact_method, {
    email: 0,
    phone: 1,
    whatsapp: 2,
    platform_messaging: 3
  }, default: :platform_messaging, validate: true

  # Validations
  validates :user, presence: true, uniqueness: true
  validates :company_name, length: {maximum: 255}
  validates :description, length: {maximum: 1500}
  validates :project_budget_range, inclusion: {
    in: %w[under_500 500_1000 1000_2500 2500_5000 5000_10000 over_10000],
    message: "must be a valid budget range",
    allow_blank: true
  }
  validates :preferred_contact_method, presence: true

  # Scopes
  scope :active, -> { where(active: true) }
  scope :completed, -> { where.not(profile_completed_at: nil) }
  scope :with_budget_range, ->(range) { where(project_budget_range: range) }

  # Profile completion tracking
  def completed?
    profile_completed_at.present? && description.present?
  end

  def completion_percentage
    total_fields = 3
    completed_fields = 0

    completed_fields += 1 if description.present?
    completed_fields += 1 if company_name.present?
    completed_fields += 1 if project_budget_range.present?

    (completed_fields.to_f / total_fields * 100).round
  end

  def mark_as_completed!
    update!(profile_completed_at: Time.current) if completed? && profile_completed_at.nil?
  end

  # Display helpers
  def display_budget_range
    return "Budget not specified" if project_budget_range.blank?

    case project_budget_range
    when "under_500"
      "Under $500"
    when "500_1000"
      "$500 - $1,000"
    when "1000_2500"
      "$1,000 - $2,500"
    when "2500_5000"
      "$2,500 - $5,000"
    when "5000_10000"
      "$5,000 - $10,000"
    when "over_10000"
      "Over $10,000"
    else
      project_budget_range.humanize
    end
  end

  def display_contact_method
    case preferred_contact_method
    when "email"
      "Email"
    when "phone"
      "Phone call"
    when "whatsapp"
      "WhatsApp"
    when "platform_messaging"
      "Platform messaging"
    else
      preferred_contact_method.humanize
    end
  end

  # Budget ranges for form options
  def self.budget_range_options
    [
      ["Under $500", "under_500"],
      ["$500 - $1,000", "500_1000"],
      ["$1,000 - $2,500", "1000_2500"],
      ["$2,500 - $5,000", "2500_5000"],
      ["$5,000 - $10,000", "5000_10000"],
      ["Over $10,000", "over_10000"]
    ]
  end

  def self.contact_method_options
    [
      ["Platform messaging", "platform_messaging"],
      ["Email", "email"],
      ["Phone call", "phone"],
      ["WhatsApp", "whatsapp"]
    ]
  end
end
