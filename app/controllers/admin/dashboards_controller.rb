# frozen_string_literal: true

class Admin::DashboardsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_admin!

  def show
    render inertia: "Admin/Dashboard/Show"
  end

  private

  def authorize_admin!
    unless current_user.admin?
      redirect_to root_path, alert: "Access denied. Only administrators can access this page."
    end
  end
end
