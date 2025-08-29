# frozen_string_literal: true

class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :set_current_request_details
  before_action :authenticate

  # Share flash messages with all Inertia responses
  inertia_share do
    flash_message = nil
    if flash[:notice]
      flash_message = {type: "notice", message: flash[:notice]}
    elsif flash[:alert]
      flash_message = {type: "alert", message: flash[:alert]}
    elsif flash[:error]
      flash_message = {type: "error", message: flash[:error]}
    end

    {
      flash: flash_message
    }.compact
  end

  # Share current user data when authenticated
  inertia_share if: :user_signed_in? do
    {
      auth: {
        user: {
          id: Current.user.id,
          email: Current.user.email,
          created_at: Current.user.created_at.strftime("%B %d, %Y")
        }
      }
    }
  end

  # Share app configuration
  inertia_share app_name: -> { Rails.application.class.module_parent_name }

  private

  def authenticate
    session_token = cookies.signed[:session_token]
    
    # Handle request spec test cookies
    if Rails.env.test? && session_token.nil? && cookies[:session_token]&.start_with?('signed:')
      session_token = cookies[:session_token].gsub(/^signed:/, '')
    end
    
    if session_record = Session.find_by_id(session_token)
      Current.session = session_record
    else
      redirect_to sign_in_path
    end
  end

  def user_signed_in?
    Current.user.present?
  end

  def set_current_request_details
    Current.user_agent = request.user_agent
    Current.ip_address = request.ip
  end
end
