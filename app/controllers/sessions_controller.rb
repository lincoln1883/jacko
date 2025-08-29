# frozen_string_literal: true

class SessionsController < ApplicationController
  skip_before_action :authenticate, only: %i[ new create ]

  before_action :set_session, only: :destroy

  def index
    render inertia: "Auth/Sessions/Index", props: {
      sessions: Current.user.sessions.order(created_at: :desc).map do |session|
        {
          id: session.id,
          user_agent: session.user_agent,
          ip_address: session.ip_address,
          created_at: session.created_at.strftime("%B %d, %Y at %l:%M %p")
        }
      end
    }
  end

  def new
    render inertia: "Auth/SignIn", props: {
      email_hint: params[:email_hint]
    }
  end

  def create
    if user = User.authenticate_by(email: params[:email], password: params[:password])
      @session = user.sessions.create!
      cookies.signed.permanent[:session_token] = {value: @session.id, httponly: true}

      redirect_to root_path, notice: "Signed in successfully"
    else
      redirect_to sign_in_path(email_hint: params[:email]), alert: "That email or password is incorrect"
    end
  end

  def destroy
    @session.destroy; redirect_to(sessions_path, notice: "That session has been logged out")
  end

  private

  def set_session
    @session = Current.user.sessions.find(params[:id])
  end
end
