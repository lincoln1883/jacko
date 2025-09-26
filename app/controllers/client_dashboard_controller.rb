# frozen_string_literal: true

class ClientDashboardController < ApplicationController
  include Rails.application.routes.url_helpers

  before_action :authenticate_user!
  before_action :authorize_client!

  def index
    @tradespeople = User.tradespeople
      .includes(:supplier_profile, :received_reviews)
      .order(created_at: :desc)
      .limit(10)

    tradespeople_json = @tradespeople.map do |tradesperson|
      profile = tradesperson.supplier_profile
      avatar_url = if profile&.avatar&.attached?
        rails_blob_url(profile.avatar, only_path: true)
      else
        nil
      end

      tradesperson.as_json(include: {supplier_profile: {only: [:id, :bio, :years_of_experience]}}).merge({
        avatar_url: avatar_url,
        average_rating: tradesperson.average_rating,
        review_count: tradesperson.review_count
      })
    end

    @client_jobs = current_user.client_jobs.order(created_at: :desc).limit(5).as_json(only: [:id, :title, :status, :created_at])

    render inertia: "Client/DashboardPage", props: {
      tradespeople: tradespeople_json,
      clientJobs: @client_jobs
    }
  end

  private

  def authorize_client!
    unless current_user.client?
      redirect_to root_path, alert: "Access denied. Only clients can access this page."
    end
  end
end
