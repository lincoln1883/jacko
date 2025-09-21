# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password

  # Role-based functionality
  enum :role, {
    client: 0,
    supplier: 1,
    contractor: 2,
    admin: 3
  }, default: 0, validate: true

  generates_token_for :email_verification, expires_in: 2.days do
    email
  end

  generates_token_for :password_reset, expires_in: 20.minutes do
    password_salt.last(10)
  end


  has_many :sessions, dependent: :destroy
  has_one :supplier_profile, dependent: :destroy
  has_one :client_profile, dependent: :destroy

  has_many :client_jobs, class_name: "Job", foreign_key: "client_id", dependent: :destroy
  has_many :supplier_jobs, through: :supplier_profile, source: :jobs, dependent: :destroy
  has_many :verification_requests, class_name: "VerificationRequest", foreign_key: "supplier_id", dependent: :destroy

  has_many :given_reviews, class_name: "Review", foreign_key: "reviewer_id", dependent: :destroy
  has_many :received_reviews, class_name: "Review", foreign_key: "reviewee_id", dependent: :destroy

  has_many :reported_disputes, class_name: "Dispute", foreign_key: "reporter_id", dependent: :destroy
  has_many :received_disputes, class_name: "Dispute", foreign_key: "reported_user_id", dependent: :destroy

  validates :email, presence: true, uniqueness: true, format: {with: URI::MailTo::EMAIL_REGEXP}
  validates :password, allow_nil: true, length: {minimum: 12}
  validates :role, presence: true, inclusion: {in: roles.keys}

  normalizes :email, with: -> { _1.strip.downcase }

  before_validation if: :email_changed?, on: :update do
    self.verified = false
  end

  after_update if: :password_digest_previously_changed? do
    sessions.where.not(id: Current.session).delete_all
  end

  # Role-based scopes
  scope :tradespeople, -> { where(role: [:supplier, :contractor]) }
  scope :clients, -> { where(role: :client) }
  scope :admins, -> { where(role: :admin) }

  # Role helper methods
  def can_create_profile?
    supplier? || contractor?
  end

  def can_hire?
    client?
  end

  def has_admin_access?
    admin?
  end

  def can_search_tradespeople?
    client? || admin?
  end

  def can_manage_users?
    admin?
  end

  def role_display
    case role
    when "client"
      "Client"
    when "supplier"
      "Supplier"
    when "contractor"
      "Contractor"
    when "admin"
      "Administrator"
    else
      role.humanize
    end
  end

  def display_role
    role.humanize
  end

  def role_color
    case role
    when "supplier", "contractor"
      "blue"
    when "client"
      "green"
    when "admin"
      "red"
    else
      "gray"
    end
  end

  # Profile helper methods
  def profile
    case role
    when "supplier", "contractor"
      supplier_profile
    when "client"
      client_profile
    else
      nil
    end
  end

  def has_profile?
    profile.present?
  end

  def profile_completed?
    return false unless has_profile?
    profile.completed?
  end

  def profile_completion_percentage
    return 0 unless has_profile?
    profile.completion_percentage
  end

  def create_appropriate_profile!
    case role
    when "supplier", "contractor"
      create_supplier_profile! unless supplier_profile.present?
    when "client"
      create_client_profile! unless client_profile.present?
    end
  end

  def ensure_profile_exists
    return if has_profile?
    create_appropriate_profile!
  end

  def profile_path
    case role
    when "supplier", "contractor"
      "/profile/supplier"
    when "client"
      "/profile/client"
    else
      "/dashboard"
    end
  end

  def average_rating
    received_reviews.average(:rating).to_f.round(2)
  end

  def review_count
    received_reviews.count
  end
end
