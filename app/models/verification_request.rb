# frozen_string_literal: true

class VerificationRequest < ApplicationRecord
  belongs_to :supplier, class_name: "User", foreign_key: "supplier_id"

  enum :status, {
    pending: 0,
    approved: 1,
    rejected: 2
  }, default: :pending, validate: true

  validates :supplier_id, presence: true, uniqueness: {message: "already has a pending or approved verification request"}
  validates :status, presence: true
  validates :notes, presence: true, length: {maximum: 1000}

  has_many_attached :documents

  validate :document_count_limit
  validate :document_file_size_and_type
  validate :documents_must_be_attached

  def document_urls
    documents.attached? ? documents.map { |doc| Rails.application.routes.url_helpers.rails_blob_url(doc, only_path: true) } : []
  end

  private

  def document_count_limit
    if documents.attached? && documents.count > 5
      errors.add(:documents, "can't upload more than 5 files")
    end
  end

  def document_file_size_and_type
    documents.each do |doc|
      if doc.byte_size > 5.megabytes
        errors.add(:documents, "#{doc.filename} size cannot exceed 5MB")
      end
      unless doc.content_type.in?(["application/pdf", "image/jpeg", "image/png"])
        errors.add(:documents, "#{doc.filename} must be a PDF, JPEG, or PNG")
      end
    end
  end

  def documents_must_be_attached
    unless documents.attached?
      errors.add(:documents, "must be attached")
    end
  end
end
