# frozen_string_literal: true

class Bid < ApplicationRecord
  belongs_to :job
  belongs_to :supplier_profile

  enum :status, {
    pending: 0,
    accepted: 1,
    rejected: 2,
    withdrawn: 3
  }, default: :pending, validate: true

  validates :amount, presence: true, numericality: {greater_than: 0}
  validates :message, length: {maximum: 1000}
  validates :status, presence: true
  validates :job_id, presence: true
  validates :supplier_profile_id, presence: true, uniqueness: {scope: :job_id, message: "already placed a bid on this job"}
end
