# frozen_string_literal: true

require "kaminari/activerecord" # Explicitly require for paginate method

class Admin::ConstructionServicesController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_admin!
  before_action :set_construction_service, only: [:show, :edit, :update, :destroy]

  def index
    page = params[:page]&.to_i || 1
    per_page = params[:per_page]&.to_i || 10
    per_page = 50 if per_page > 50

    total_count = ConstructionService.count
    services = ConstructionService.order(name: :asc).limit(per_page).offset((page - 1) * per_page)

    paginated_result = OpenStruct.new(
      current_page: page,
      per_page: per_page,
      total_count: total_count,
      total_pages: (total_count.to_f / per_page).ceil,
      prev_page: page > 1 ? page - 1 : nil,
      next_page: page < (total_count.to_f / per_page).ceil ? page + 1 : nil,
      records: services
    )

    render inertia: "Admin/ConstructionServices/Index", props: {
      services: paginated_result.records.as_json,
      pagination: {
        currentPage: paginated_result.current_page,
        totalPages: paginated_result.total_pages,
        totalCount: paginated_result.total_count
      }
    }
  end

  def show
    render inertia: "Admin/ConstructionServices/Show", props: {
      service: @construction_service.as_json
    }
  end

  def new
    @construction_service = ConstructionService.new
    render inertia: "Admin/ConstructionServices/New", props: {
      service: @construction_service.as_json
    }
  end

  def create
    @construction_service = ConstructionService.new(construction_service_params)

    if @construction_service.save
      redirect_to admin_construction_service_path(@construction_service), notice: "Construction service created successfully."
    else
      render inertia: "Admin/ConstructionServices/New", props: {
        service: @construction_service.as_json,
        errors: @construction_service.errors.full_messages
      }, status: :unprocessable_content
    end
  end

  def edit
    render inertia: "Admin/ConstructionServices/Edit", props: {
      service: @construction_service.as_json
    }
  end

  def update
    if @construction_service.update(construction_service_params)
      redirect_to admin_construction_service_path(@construction_service), notice: "Construction service updated successfully."
    else
      render inertia: "Admin/ConstructionServices/Edit", props: {
        service: @construction_service.as_json,
        errors: @construction_service.errors.full_messages
      }, status: :unprocessable_content
    end
  end

  def destroy
    @construction_service.destroy
    redirect_to admin_construction_services_path, notice: "Construction service deleted successfully."
  end

  private

  def set_construction_service
    @construction_service = ConstructionService.find(params[:id])
  end

  def construction_service_params
    params.require(:construction_service).permit(:name, :unit, :price, :category)
  end

  def authorize_admin!
    unless current_user.admin?
      redirect_to root_path, alert: "Access denied. Only administrators can access this page."
    end
  end
end
