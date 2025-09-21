# frozen_string_literal: true

class Job < ApplicationRecord
  belongs_to :parish
  belongs_to :client, class_name: "User", foreign_key: "client_id"
  belongs_to :supplier_profile, optional: true

  has_many :bids, dependent: :destroy
  has_many :reviews, dependent: :destroy
  has_many :disputes, dependent: :destroy

  enum :status, {
    open: 0,
    bidding: 1,
    in_progress: 2,
    completed: 3,
    cancelled: 4
  }, default: :open, validate: true

  validates :title, presence: true, length: {maximum: 255}
  validates :description, presence: true, length: {maximum: 5000}
  validates :budget, presence: true, numericality: {greater_than: 0}
  validates :due_date, presence: true
  validates :location, presence: true, length: {maximum: 255}
  validates :status, presence: true
  validates :client_id, presence: true
  validates :parish_id, presence: true
  validates :supplier_profile_id, presence: true, if: :bidding?

  # Scopes
  scope :active, -> { where(status: [:open, :bidding, :in_progress]) }
  scope :for_client, ->(client_id) { where(client_id: client_id) }
  scope :by_parish, ->(parish_id) { where(parish_id: parish_id) }
  scope :open_for_bidding, -> { where(status: :open) }
end
