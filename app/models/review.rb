# frozen_string_literal: true

class Review < ApplicationRecord
  belongs_to :job
  belongs_to :reviewer, class_name: "User", foreign_key: "reviewer_id"
  belongs_to :reviewee, class_name: "User", foreign_key: "reviewee_id"

  validates :rating, presence: true, numericality: {in: 1..5}
  validates :comment, length: {maximum: 1000}
  validates :job_id, presence: true
  validates :reviewer_id, presence: true
  validates :reviewee_id, presence: true
  validates :job_id, uniqueness: {scope: [:reviewer_id, :reviewee_id], message: "can only be reviewed once by this user for this reviewee"}

  # Scopes for filtering reviews
  scope :by_job, ->(job_id) { where(job_id: job_id) }
  scope :by_reviewer, ->(reviewer_id) { where(reviewer_id: reviewer_id) }
  scope :by_reviewee, ->(reviewee_id) { where(reviewee_id: reviewee_id) }
  scope :positive, -> { where("rating >= ?", 4) }
  scope :negative, -> { where("rating <= ?", 2) }
  scope :average_rating, -> { average(:rating) }
end
