# frozen_string_literal: true

class PortfolioImage < ApplicationRecord
  # Associations
  belongs_to :supplier_profile
  has_one_attached :image

  # Validations
  validates :title, length: {maximum: 255}
  validates :description, length: {maximum: 1000}
  validates :image_alt_text, length: {maximum: 255}
  validates :display_order, presence: true, numericality: {greater_than_or_equal_to: 0}
  validates :active, inclusion: {in: [true, false]}
  validate :image_attached
  validate :image_content_type
  validate :image_size

  # Scopes
  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(:display_order, :created_at) }
  scope :by_profile, ->(profile_id) { where(supplier_profile_id: profile_id) }

  # Callbacks
  before_validation :set_default_display_order, on: :create
  before_validation :generate_alt_text_if_missing

  # Instance methods
  def display_name
    title.presence || "Portfolio Image ##{id}"
  end

  def image_variants
    return {} unless image.attached?

    {
      thumbnail: image.variant(resize_to_limit: [150, 150]),
      small: image.variant(resize_to_limit: [300, 300]),
      medium: image.variant(resize_to_limit: [600, 600]),
      large: image.variant(resize_to_limit: [1200, 1200])
    }
  end

  def image_url(variant = :medium)
    return nil unless image.attached? && image.blob.persisted?

    begin
      case variant.to_sym
      when :original
        Rails.application.routes.url_helpers.rails_blob_url(image, host: Rails.application.config.action_mailer.default_url_options[:host] || "localhost:3000")
      else
        variant_image = image_variants[variant.to_sym]
        if variant_image
          Rails.application.routes.url_helpers.rails_blob_url(variant_image, host: Rails.application.config.action_mailer.default_url_options[:host] || "localhost:3000")
        else
          nil
        end
      end
    rescue => e
      Rails.logger.warn "Error generating image URL: #{e.message}"
      nil
    end
  end

  def file_size_mb
    return 0 unless image.attached?
    (image.blob.byte_size.to_f / 1.megabyte).round(2)
  end

  def dimensions
    return {} unless image.attached? && image.blob.metadata[:width] && image.blob.metadata[:height]

    {
      width: image.blob.metadata[:width],
      height: image.blob.metadata[:height],
      aspect_ratio: (image.blob.metadata[:width].to_f / image.blob.metadata[:height]).round(2)
    }
  end

  private

  def set_default_display_order
    return if display_order.present?

    max_order = supplier_profile&.portfolio_images&.maximum(:display_order) || 0
    self.display_order = max_order + 1
  end

  def generate_alt_text_if_missing
    return if image_alt_text.present? || !image.attached?

    self.image_alt_text = if title.present?
      "#{title} - #{supplier_profile&.company_name || 'Portfolio'} work"
    else
      "Portfolio work by #{supplier_profile&.company_name || 'supplier'}"
    end
  end

  def image_attached
    return if image.attached?

    errors.add(:image, "must be attached")
  end

  def image_content_type
    return unless image.attached?

    acceptable_types = %w[image/jpeg image/png image/webp]
    unless acceptable_types.include?(image.content_type)
      errors.add(:image, "must be a JPEG, PNG, or WebP image")
    end
  end

  def image_size
    return unless image.attached?

    if image.blob.byte_size > 10.megabytes
      errors.add(:image, "must be less than 10MB")
    end
  end
end
