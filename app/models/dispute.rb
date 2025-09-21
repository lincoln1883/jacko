# frozen_string_literal: true

class Dispute < ApplicationRecord
  belongs_to :job
  belongs_to :reporter, class_name: "User", foreign_key: "reporter_id"
  belongs_to :reported_user, class_name: "User", foreign_key: "reported_user_id"

  enum :status, {
    pending: 0,
    resolved: 1,
    escalated: 2
  }, default: :pending, validate: true

  validates :reason, presence: true, length: {maximum: 255}
  validates :description, presence: true, length: {maximum: 1000}
  validates :status, presence: true
  validates :job_id, presence: true
  validates :reporter_id, presence: true
  validates :reported_user_id, presence: true
  validate :cannot_report_self

  private

  def cannot_report_self
    if reporter_id == reported_user_id
      errors.add(:reported_user_id, "cannot be the same as the reporter")
    end
  end
end
