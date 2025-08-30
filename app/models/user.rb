# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password

  # Role-based functionality
  enum :role, {
    client: 0,
    tradesperson: 1, 
    admin: 2
  }, default: 0, validate: true

  generates_token_for :email_verification, expires_in: 2.days do
    email
  end

  generates_token_for :password_reset, expires_in: 20.minutes do
    password_salt.last(10)
  end


  has_many :sessions, dependent: :destroy

  validates :email, presence: true, uniqueness: true, format: {with: URI::MailTo::EMAIL_REGEXP}
  validates :password, allow_nil: true, length: {minimum: 12}
  validates :role, presence: true, inclusion: { in: roles.keys }

  normalizes :email, with: -> { _1.strip.downcase }

  before_validation if: :email_changed?, on: :update do
    self.verified = false
  end

  after_update if: :password_digest_previously_changed? do
    sessions.where.not(id: Current.session).delete_all
  end

  # Role-based scopes
  scope :tradespeople, -> { where(role: :tradesperson) }
  scope :clients, -> { where(role: :client) }
  scope :admins, -> { where(role: :admin) }

  # Role helper methods
  def can_create_profile?
    tradesperson?
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
    when 'client'
      'Client'
    when 'tradesperson'
      'Tradesperson'
    when 'admin'
      'Administrator'
    else
      role.humanize
    end
  end

  def display_role
    role.humanize
  end

  def role_color
    case role
    when 'tradesperson'
      'blue'
    when 'client'
      'green'
    when 'admin'
      'red'
    else
      'gray'
    end
  end
end
