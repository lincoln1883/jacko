# frozen_string_literal: true

class Admin::VerificationRequestsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_admin!
  before_action :set_verification_request, only: [:show, :update]

  def index
    page = params[:page]&.to_i || 1
    per_page = params[:per_page]&.to_i || 10
    per_page = 50 if per_page > 50

    total_count = VerificationRequest.count
    verification_requests = VerificationRequest.order(created_at: :desc).limit(per_page).offset((page - 1) * per_page)

    paginated_result = OpenStruct.new(
      current_page: page,
      per_page: per_page,
      total_count: total_count,
      total_pages: (total_count.to_f / per_page).ceil,
      prev_page: page > 1 ? page - 1 : nil,
      next_page: page < (total_count.to_f / per_page).ceil ? page + 1 : nil,
      records: verification_requests
    )

    render inertia: "Admin/VerificationRequests/Index", props: {
      verificationRequests: paginated_result.records.as_json(include: {supplier: {only: [:id, :email, :verified]}}),
      pagination: {
        currentPage: paginated_result.current_page,
        totalPages: paginated_result.total_pages,
        totalCount: paginated_result.total_count,
        perPage: paginated_result.per_page,
        prevPage: paginated_result.prev_page,
        nextPage: paginated_result.next_page
      },
      allStatuses: VerificationRequest.statuses.keys
    }
  end

  def show
    render inertia: "Admin/VerificationRequests/Show", props: {
      verificationRequest: @verification_request.as_json(methods: [:document_urls], include: {supplier: {only: [:id, :email, :verified]}})
    }
  end

  def update
    if @verification_request.update(verification_request_params)
      if @verification_request.approved?
        @verification_request.supplier.update(verified: true)
        redirect_to admin_verification_request_path(@verification_request), notice: "Verification request approved and supplier marked as verified!"
      elsif @verification_request.rejected?
        @verification_request.supplier.update(verified: false) unless @verification_request.supplier.verification_requests.approved.any?
        redirect_to admin_verification_request_path(@verification_request), notice: "Verification request rejected!"
      else
        redirect_to admin_verification_request_path(@verification_request), alert: "Invalid status for update."
      end
    else
      redirect_to admin_verification_request_path(@verification_request), alert: "Failed to update verification request."
    end
  end

  private

  def set_verification_request
    @verification_request = VerificationRequest.find(params[:id])
  end

  def verification_request_params
    params.require(:verification_request).permit(:status, :notes)
  end

  def authorize_admin!
    unless current_user.admin?
      redirect_to root_path, alert: "Access denied. Only administrators can access this page."
    end
  end
end
