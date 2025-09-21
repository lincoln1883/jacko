# frozen_string_literal: true

class SupplierProfile < ApplicationRecord
  belongs_to :user
  belongs_to :parish

  # Skills associations
  has_many :supplier_skills, dependent: :destroy
  has_many :skills, through: :supplier_skills

  # Jobs association
  has_many :jobs, foreign_key: "supplier_profile_id", dependent: :nullify # Changed from :destroy for now

  # Portfolio associations
  has_many :portfolio_images, dependent: :destroy

  # Avatar attachment
  has_one_attached :avatar

  # Availability status enum
  enum :availability_status, {
    is_available: 0,
    busy: 1,
    unavailable: 2,
    booked: 3
  }, default: :is_available, validate: true

  # Experience level enum
  enum :experience_level, {
    graduate: 0,
    intermediate: 1,
    expert: 2,
    master: 3
  }, default: nil, validate: true

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
  validates :experience_level, inclusion: {in: experience_levels.keys, allow_nil: true}
  validates :service_radius_km, numericality: {
    greater_than: 0,
    less_than_or_equal_to: 500,
    allow_nil: true
  }
  # validates :additional_parishes, array: {
  #   of: :string,
  #   message: "must be an array of strings",
  #   allow_nil: true
  # }

  # Avatar validations
  validate :avatar_validation

  # Scopes
  scope :active, -> { where(active: true) }
  scope :available, -> { where(availability_status: :is_available) }
  scope :with_experience, ->(years) { where("years_experience >= ?", years) }
  scope :with_rate_range, ->(min, max) { where(hourly_rate: min..max) }
  scope :completed, -> { where.not(profile_completed_at: nil) }
  scope :with_skills, ->(skill_ids) { joins(:skills).where(skills: {id: skill_ids}) }
  scope :with_skill_categories, ->(categories) { joins(:skills).where(skills: {category: categories}) }
  scope :search_by_text, ->(query) { where("bio LIKE ? OR description LIKE ? OR company_name LIKE ?", "%#{query}%", "%#{query}%", "%#{query}%") }

  # Profile completion tracking
  def completed?
    profile_completed_at.present? &&
      bio.present? &&
      description.present? &&
      years_experience.present? &&
      experience_level.present? &&
      parish_id.present? &&
      service_area_notes.present?
  end

  def completion_percentage
    total_fields = 13 # Increased from 12 to account for experience_level
    completed_fields = 0

    completed_fields += 1 if bio.present?
    completed_fields += 1 if description.present?
    completed_fields += 1 if years_experience.present?
    completed_fields += 1 if experience_level.present?
    completed_fields += 1 if hourly_rate.present?
    completed_fields += 1 if phone.present?
    completed_fields += 1 if company_name.present?
    completed_fields += 1 if skills.any?
    completed_fields += 1 if portfolio_images.active.any?
    completed_fields += 1 if avatar.attached?
    completed_fields += 1 if parish_id.present?
    completed_fields += 1 if service_area_notes.present?
    completed_fields += 1 if service_radius_km.present?

    (completed_fields.to_f / total_fields * 100).round
  end

  def mark_as_completed!
    # Check if profile has required fields (excluding profile_completed_at)
    if bio.present? && description.present? && years_experience.present? && experience_level.present? && skills.any? && parish_id.present? && service_area_notes.present? && profile_completed_at.nil?
      update!(profile_completed_at: Time.current)
    end
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
    when "is_available"
      "Available"
    when "busy"
      "Busy"
    when "unavailable"
      "Unavailable"
    when "booked"
      "Booked"
    else
      availability_status.humanize
    end
  end

  def availability_color
    case availability_status
    when "is_available"
      "green"
    when "busy"
      "yellow"
    when "unavailable", "booked"
      "red"
    else
      "gray"
    end
  end

  # Skills helper methods
  def skill_names
    skills.pluck(:name)
  end

  def skills_by_category
    skills.group_by(&:category)
  end

  def primary_skills(limit = 3)
    skills.limit(limit)
  end

  def has_skill?(skill_name)
    skill_names.include?(skill_name)
  end

  def add_skill(skill)
    skills << skill unless skills.include?(skill)
  end

  def remove_skill(skill)
    skills.delete(skill)
  end

  # Portfolio helper methods
  def active_portfolio_images
    portfolio_images.active.ordered
  end

  def portfolio_image_count
    portfolio_images.active.count
  end

  def has_portfolio_images?
    portfolio_images.active.any?
  end

  def featured_portfolio_image
    active_portfolio_images.first
  end

  def portfolio_images_for_gallery
    active_portfolio_images.limit(12)
  end

  # Maximum portfolio images allowed
  def max_portfolio_images
    20
  end

  def can_add_portfolio_image?
    portfolio_image_count < max_portfolio_images
  end

  def portfolio_storage_used_mb
    return 0 unless portfolio_images.any?

    portfolio_images.sum { |img| img.file_size_mb }
  end

  # Maximum storage limit in MB
  def max_portfolio_storage_mb
    100 # 100MB limit per profile
  end

  def portfolio_storage_available?
    portfolio_storage_used_mb < max_portfolio_storage_mb
  end

  # Avatar helper methods
  def has_avatar?
    avatar.attached?
  end

  def avatar_url
    return nil unless avatar.attached?
    Rails.application.routes.url_helpers.rails_blob_url(avatar, only_path: true)
  end

  def avatar_thumbnail_url
    return nil unless avatar.attached?
    Rails.application.routes.url_helpers.rails_representation_url(
      avatar.variant(resize_to_limit: [150, 150]).processed,
      only_path: true
    )
  rescue StandardError
    avatar_url
  end

  def average_rating
    user.received_reviews.average(:rating).to_f.round(2)
  end

  def review_count
    user.received_reviews.count
  end

  private

  def avatar_validation
    return unless avatar.attached?

    # Check file size (max 5MB)
    if avatar.blob.byte_size > 5.megabytes
      errors.add(:avatar, "must be less than 5MB")
    end

    # Check file type
    unless avatar.blob.content_type.in?(["image/jpeg", "image/png", "image/webp"])
      errors.add(:avatar, "must be a JPEG, PNG, or WebP image")
    end
  end
end
