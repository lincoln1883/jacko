# frozen_string_literal: true

class Admin::DisputesController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_admin!
  before_action :set_dispute, only: [:show, :update]

  def index
    page = params[:page]&.to_i || 1
    per_page = params[:per_page]&.to_i || 10
    per_page = 50 if per_page > 50

    total_count = Dispute.count
    disputes = Dispute.order(created_at: :desc).limit(per_page).offset((page - 1) * per_page)

    paginated_result = OpenStruct.new(
      current_page: page,
      per_page: per_page,
      total_count: total_count,
      total_pages: (total_count.to_f / per_page).ceil,
      prev_page: page > 1 ? page - 1 : nil,
      next_page: page < (total_count.to_f / per_page).ceil ? page + 1 : nil,
      records: disputes
    )

    render inertia: "Admin/Disputes/Index", props: {
      disputes: paginated_result.records.as_json(include: {
        job: {only: [:id, :title]},
        reporter: {only: [:id, :email, :role_display]},
        reported_user: {only: [:id, :email, :role_display]}
      }),
      pagination: {
        currentPage: paginated_result.current_page,
        totalPages: paginated_result.total_pages,
        totalCount: paginated_result.total_count,
        perPage: paginated_result.per_page,
        prevPage: paginated_result.prev_page,
        nextPage: paginated_result.next_page
      },
      allStatuses: Dispute.statuses.keys
    }
  end

  def show
    render inertia: "Admin/Disputes/Show", props: {
      dispute: @dispute.as_json(include: {
        job: {only: [:id, :title]},
        reporter: {only: [:id, :email, :role_display]},
        reported_user: {only: [:id, :email, :role_display]}
      })
    }
  end

  def update
    if @dispute.update(dispute_params)
      redirect_to admin_dispute_path(@dispute), notice: "Dispute status updated successfully!"
    else
      render inertia: "Admin/Disputes/Show", props: {
        dispute: @dispute.as_json(include: {
          job: {only: [:id, :title]},
          reporter: {only: [:id, :email, :role_display]},
          reported_user: {only: [:id, :email, :role_display]}
        }),
        errors: @dispute.errors.full_messages
      }, status: :unprocessable_content
    end
  end

  private

  def set_dispute
    @dispute = Dispute.find(params[:id])
  end

  def dispute_params
    params.require(:dispute).permit(:status, :notes)
  end

  def authorize_admin!
    unless current_user.admin?
      redirect_to root_path, alert: "Access denied. Only administrators can access this page."
    end
  end
end
