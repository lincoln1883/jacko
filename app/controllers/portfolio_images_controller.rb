# frozen_string_literal: true

class PortfolioImagesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_profile
  before_action :authorize_profile_access!
  before_action :set_portfolio_image, only: [:show, :update, :destroy]

  # GET /portfolio_images
  def index
    @portfolio_images = @profile.portfolio_images.includes(image_attachment: :blob)
                                .ordered.limit(50)

    render json: {
      portfolio_images: serialize_portfolio_images(@portfolio_images),
      meta: {
        total_count: @portfolio_images.count,
        can_add_more: @profile.can_add_portfolio_image?,
        storage_used_mb: @profile.portfolio_storage_used_mb,
        storage_limit_mb: @profile.max_portfolio_storage_mb
      }
    }
  end

  # POST /portfolio_images
  def create
    unless @profile.can_add_portfolio_image?
      render json: {error: "Portfolio image limit reached (#{@profile.max_portfolio_images} maximum)"}, status: :unprocessable_entity
      return
    end

    unless @profile.portfolio_storage_available?
      render json: {error: "Storage limit reached (#{@profile.max_portfolio_storage_mb}MB maximum)"}, status: :unprocessable_entity
      return
    end

    @portfolio_image = @profile.portfolio_images.build(portfolio_image_params)

    if @portfolio_image.save
      render json: {
        portfolio_image: serialize_portfolio_image(@portfolio_image),
        message: "Portfolio image uploaded successfully!"
      }, status: :created
    else
      render json: {
        error: "Failed to upload portfolio image",
        errors: @portfolio_image.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # GET /portfolio_images/:id
  def show
    render json: {
      portfolio_image: serialize_portfolio_image(@portfolio_image)
    }
  end

  # PATCH /portfolio_images/:id
  def update
    if @portfolio_image.update(portfolio_image_update_params)
      render json: {
        portfolio_image: serialize_portfolio_image(@portfolio_image),
        message: "Portfolio image updated successfully!"
      }
    else
      render json: {
        error: "Failed to update portfolio image",
        errors: @portfolio_image.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # DELETE /portfolio_images/:id
  def destroy
    if @portfolio_image.destroy
      render json: {
        message: "Portfolio image deleted successfully!"
      }
    else
      render json: {
        error: "Failed to delete portfolio image"
      }, status: :unprocessable_entity
    end
  end

  # POST /portfolio_images/reorder
  def reorder
    image_ids = params[:image_ids]

    return render json: {error: "Invalid image IDs"}, status: :bad_request unless image_ids.is_a?(Array)

    # Update display order based on array position
    image_ids.each_with_index do |id, index|
      portfolio_image = @profile.portfolio_images.find_by(id: id)
      portfolio_image&.update(display_order: index + 1)
    end

    render json: {message: "Portfolio images reordered successfully!"}
  end

  private

  def set_profile
    @profile = current_user.trades_person_profile

    unless @profile
      render json: {error: "Tradesperson profile not found"}, status: :not_found
    end
  end

  def set_portfolio_image
    @portfolio_image = @profile.portfolio_images.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: {error: "Portfolio image not found"}, status: :not_found
  end

  def authorize_profile_access!
    unless @profile&.user == current_user
      render json: {error: "Access denied"}, status: :forbidden
    end
  end

  def portfolio_image_params
    params.require(:portfolio_image).permit(:image, :title, :description, :image_alt_text)
  end

  def portfolio_image_update_params
    params.require(:portfolio_image).permit(:title, :description, :image_alt_text, :active, :display_order)
  end

  def serialize_portfolio_image(portfolio_image)
    {
      id: portfolio_image.id,
      title: portfolio_image.title,
      description: portfolio_image.description,
      image_alt_text: portfolio_image.image_alt_text,
      display_order: portfolio_image.display_order,
      active: portfolio_image.active,
      file_size_mb: portfolio_image.file_size_mb,
      dimensions: portfolio_image.dimensions,
      image_urls: {
        thumbnail: portfolio_image.image_url(:thumbnail),
        small: portfolio_image.image_url(:small),
        medium: portfolio_image.image_url(:medium),
        large: portfolio_image.image_url(:large),
        original: portfolio_image.image_url(:original)
      },
      created_at: portfolio_image.created_at,
      updated_at: portfolio_image.updated_at
    }
  end

  def serialize_portfolio_images(portfolio_images)
    portfolio_images.map { |img| serialize_portfolio_image(img) }
  end
end
