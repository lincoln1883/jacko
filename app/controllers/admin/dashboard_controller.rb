# frozen_string_literal: true

class Admin::DashboardController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_admin!

  def index
    @user_count = User.count
    @supplier_count = User.supplier.count
    @client_count = User.client.count
    @pending_verification_requests_count = VerificationRequest.pending.count
    @open_jobs_count = Job.open.count
    @pending_disputes_count = Dispute.pending.count

    render inertia: "Admin/Dashboard/Index", props: {
      userCount: @user_count,
      supplierCount: @supplier_count,
      clientCount: @client_count,
      pendingVerificationRequestsCount: @pending_verification_requests_count,
      openJobsCount: @open_jobs_count,
      pendingDisputesCount: @pending_disputes_count
    }
  end

  private

  def authorize_admin!
    unless current_user.admin?
      redirect_to root_path, alert: "Access denied. Only administrators can access this page."
    end
  end
end
