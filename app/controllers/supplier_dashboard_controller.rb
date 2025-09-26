# frozen_string_literal: true

class SupplierDashboardController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_supplier_or_contractor!

  def index
    @open_jobs = Job.open_for_bidding.includes(:client, :parish).order(created_at: :desc).limit(10)
    render inertia: "Supplier/DashboardPage", props: {
      openJobs: @open_jobs.as_json(include: {client: {only: [:id, :email]}, parish: {only: [:id, :name]}})
    }
  end

  private

  def authorize_supplier_or_contractor!
    unless current_user.supplier? || current_user.contractor?
      redirect_to root_path, alert: "Access denied. Only suppliers or contractors can access this page."
    end
  end
end
