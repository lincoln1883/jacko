# frozen_string_literal: true

class TradesPersonProfile < ApplicationRecord
  belongs_to :user

  # Availability status enum
  enum :availability_status, {
    available: 0,
    busy: 1,
    unavailable: 2,
    booked: 3
  }, default: :available, validate: true

  # Validations
  validates :user, presence: true, uniqueness: true
  validates :bio, length: {maximum: 1000}
  validates :company_name, length: {maximum: 255}
  validates :description, length: {maximum: 2000}
  validates :years_experience, numericality: {
    greater_than_or_equal_to: 0,
    less_than_or_equal_to: 50,
    allow_nil: true
  }
  validates :hourly_rate, numericality: {
    greater_than: 0,
    less_than: 10000,
    allow_nil: true
  }
  validates :phone, format: {
    with: /\A[\d\s\-\+\(\)]+\z/,
    message: "must be a valid phone number",
    allow_blank: true
  }
  validates :website, format: {
    with: URI::DEFAULT_PARSER.make_regexp(%w[http https]),
    message: "must be a valid URL",
    allow_blank: true
  }
  validates :availability_status, presence: true

  # Scopes
  scope :active, -> { where(active: true) }
  scope :available, -> { where(availability_status: :available) }
  scope :with_experience, ->(years) { where("years_experience >= ?", years) }
  scope :with_rate_range, ->(min, max) { where(hourly_rate: min..max) }
  scope :completed, -> { where.not(profile_completed_at: nil) }

  # Profile completion tracking
  def completed?
    bio.present? &&
      description.present? &&
      years_experience.present?
  end

  def completion_percentage
    total_fields = 6
    completed_fields = 0

    completed_fields += 1 if bio.present?
    completed_fields += 1 if description.present?
    completed_fields += 1 if years_experience.present?
    completed_fields += 1 if hourly_rate.present?
    completed_fields += 1 if phone.present?
    completed_fields += 1 if company_name.present?

    (completed_fields.to_f / total_fields * 100).round
  end

  def mark_as_completed!
    update!(profile_completed_at: Time.current) if completed? && profile_completed_at.nil?
  end

  # Display helpers
  def display_hourly_rate
    return "Rate not specified" if hourly_rate.blank?
    "$#{hourly_rate}/hr"
  end

  def display_experience
    return "No experience specified" if years_experience.blank?
    case years_experience
    when 0
      "Entry level"
    when 1
      "1 year experience"
    else
      "#{years_experience} years experience"
    end
  end

  def display_availability
    case availability_status
    when "available"
      "Available for new projects"
    when "busy"
      "Busy but accepting inquiries"
    when "unavailable"
      "Currently unavailable"
    when "booked"
      "Fully booked"
    else
      availability_status.humanize
    end
  end

  def availability_color
    case availability_status
    when "available"
      "green"
    when "busy"
      "yellow"
    when "unavailable", "booked"
      "red"
    else
      "gray"
    end
  end
end
