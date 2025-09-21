# frozen_string_literal: true

class AvatarsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_supplier!
  before_action :set_profile

  def create
    if @profile.avatar.attach(avatar_params)
      render json: {
        success: true,
        message: "Avatar uploaded successfully",
        avatar_url: @profile.avatar_url,
        avatar_thumbnail_url: @profile.avatar_thumbnail_url
      }
    else
      render json: {
        success: false,
        errors: @profile.errors.full_messages
      }, status: :unprocessable_content
    end
  end

  def update
    if @profile.avatar.attached?
      @profile.avatar.purge
    end

    if @profile.avatar.attach(avatar_params)
      render json: {
        success: true,
        message: "Avatar updated successfully",
        avatar_url: @profile.avatar_url,
        avatar_thumbnail_url: @profile.avatar_thumbnail_url
      }
    else
      render json: {
        success: false,
        errors: @profile.errors.full_messages
      }, status: :unprocessable_content
    end
  end

  def destroy
    if @profile.avatar.attached?
      @profile.avatar.purge
      render json: {
        success: true,
        message: "Avatar deleted successfully"
      }
    else
      render json: {
        success: false,
        message: "No avatar to delete"
      }, status: :unprocessable_content
    end
  end

  private

  def set_profile
    @profile = current_user.supplier_profile

    unless @profile
      render json: {
        success: false,
        message: "Supplier profile not found"
      }, status: :not_found
    end
  end

  def ensure_supplier!
    unless current_user.supplier? || current_user.contractor?
      render json: {
        success: false,
        message: "Access denied. Only suppliers or contractors can manage avatars."
      }, status: :forbidden
    end
  end

  def avatar_params
    params.require(:avatar)
  end
end
