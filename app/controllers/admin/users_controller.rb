# frozen_string_literal: true

class Admin::UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_admin!
  before_action :set_user, only: [:show, :update]

  def index
    page = params[:page]&.to_i || 1
    per_page = params[:per_page]&.to_i || 10
    per_page = 50 if per_page > 50

    total_count = User.count
    users = User.order(created_at: :desc).limit(per_page).offset((page - 1) * per_page)

    paginated_result = OpenStruct.new(
      current_page: page,
      per_page: per_page,
      total_count: total_count,
      total_pages: (total_count.to_f / per_page).ceil,
      prev_page: page > 1 ? page - 1 : nil,
      next_page: page < (total_count.to_f / per_page).ceil ? page + 1 : nil,
      records: users
    )

    render inertia: "Admin/Users/Index", props: {
      users: paginated_result.records.as_json(include: [:supplier_profile]),
      pagination: {
        currentPage: paginated_result.current_page,
        totalPages: paginated_result.total_pages,
        totalCount: paginated_result.total_count,
        perPage: paginated_result.per_page,
        prevPage: paginated_result.prev_page,
        nextPage: paginated_result.next_page
      }
    }
  end

  def show
    render inertia: "Admin/Users/Show", props: {
      user: @user.as_json(include: [:supplier_profile, :client_profile, :verification_requests])
    }
  end

  def update
    if @user.update(user_params)
      redirect_to admin_user_path(@user), notice: "User updated successfully."
    else
      render inertia: "Admin/Users/Show", props: {
        user: @user.as_json(include: [:supplier_profile, :client_profile, :verification_requests]),
        errors: @user.errors.full_messages
      }, status: :unprocessable_content
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:role, :verified)
  end

  def authorize_admin!
    unless current_user.admin?
      redirect_to root_path, alert: "Access denied. Only administrators can access this page."
    end
  end
end
