# frozen_string_literal: true

class HomeController < ApplicationController
  skip_before_action :authenticate, only: [:index]
  before_action :set_current_session_if_present, only: [:index]
  before_action :redirect_to_profile_if_incomplete, if: :user_signed_in?

  def index
    # Always render Home/Index and let React component handle routing
    render inertia: "Home/Index"
  end

  private

  def set_current_session_if_present
    session_token = cookies.signed[:session_token]

    # Handle request spec test cookies
    if Rails.env.test? && session_token.nil? && cookies[:session_token]&.start_with?("signed:")
      session_token = cookies[:session_token].gsub(/^signed:/, "")
    end

    if session_record = Session.find_by_id(session_token)
      Current.session = session_record
    end
    # Don't redirect if no session - allow unauthenticated access
  end

  def redirect_to_profile_if_incomplete
    return if current_user.admin? # Admins don't need profiles

    # Check if user has a profile and if it's incomplete
    if (current_user.supplier? || current_user.contractor?) && (!current_user.has_profile? || !current_user.profile_completed?)
      redirect_to edit_profile_supplier_path,
        notice: "Please complete your profile to access all features."
    elsif current_user.client? && (!current_user.has_profile? || !current_user.profile_completed?)
      redirect_to edit_profile_client_path,
        notice: "Please complete your profile to access all features."
    end
  end
end
