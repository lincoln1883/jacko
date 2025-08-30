# frozen_string_literal: true

class RegistrationsController < ApplicationController
  skip_before_action :authenticate, only: %i[ new create ]

  def new
    render inertia: "Auth/SignUp"
  end

  def create
    @user = User.new(user_params)

    if @user.save
      session_record = @user.sessions.create!
      cookies.signed.permanent[:session_token] = {value: session_record.id, httponly: true}

      send_email_verification

      # Redirect to appropriate profile creation based on role
      if @user.tradesperson?
        redirect_to edit_profile_tradesperson_path, notice: "Welcome! Please complete your tradesperson profile to get started."
      elsif @user.client?
        redirect_to edit_profile_client_path, notice: "Welcome! Please complete your client profile to get started."
      else
        redirect_to root_path, notice: "Welcome! You have signed up successfully"
      end
    else
      render inertia: "Auth/SignUp", props: {
        errors: @user.errors.messages
      }, status: :unprocessable_content
    end
  end

  private

  def user_params
    params.permit(:email, :password, :password_confirmation)
  end

  def send_email_verification
    if Rails.env.test?
      UserMailer.with(user: @user).email_verification.deliver_now
    else
      UserMailer.with(user: @user).email_verification.deliver_later
    end
  end
end
