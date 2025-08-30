# frozen_string_literal: true

class HomeController < ApplicationController
  before_action :redirect_to_profile_if_incomplete

  def index
    render inertia: "Home/Index"
  end

  private

  def redirect_to_profile_if_incomplete
    return unless user_signed_in?
    return if current_user.admin? # Admins don't need profiles

    # Check if user has a profile and if it's incomplete
    if current_user.tradesperson? && (!current_user.has_profile? || !current_user.profile_completed?)
      redirect_to edit_profile_tradesperson_path,
        notice: "Please complete your profile to access all features."
    elsif current_user.client? && (!current_user.has_profile? || !current_user.profile_completed?)
      redirect_to edit_profile_client_path,
        notice: "Please complete your profile to access all features."
    end
  end
end
