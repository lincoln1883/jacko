# frozen_string_literal: true

class Admin::JobsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_admin!
  before_action :set_job, only: [:show, :edit, :update, :destroy]

  def index
    page = params[:page]&.to_i || 1
    per_page = params[:per_page]&.to_i || 10
    per_page = 50 if per_page > 50

    total_count = Job.count
    jobs = Job.order(created_at: :desc).limit(per_page).offset((page - 1) * per_page)

    paginated_result = OpenStruct.new(
      current_page: page,
      per_page: per_page,
      total_count: total_count,
      total_pages: (total_count.to_f / per_page).ceil,
      prev_page: page > 1 ? page - 1 : nil,
      next_page: page < (total_count.to_f / per_page).ceil ? page + 1 : nil,
      records: jobs
    )

    render inertia: "Admin/Jobs/Index", props: {
      jobs: paginated_result.records.as_json(include: [:client, :parish]),
      pagination: {
        currentPage: paginated_result.current_page,
        totalPages: paginated_result.total_pages,
        totalCount: paginated_result.total_count
      }
    }
  end

  def show
    render inertia: "Admin/Jobs/Show", props: {
      job: @job.as_json(include: [:client, :parish, {bids: {include: :supplier_profile}}])
    }
  end

  def new
    @job = Job.new
    render inertia: "Admin/Jobs/New", props: {
      job: @job.as_json
    }
  end

  def create
    @job = Job.new(job_params)

    if @job.save
      redirect_to admin_job_path(@job), notice: "Job created successfully."
    else
      render inertia: "Admin/Jobs/New", props: {
        job: @job.as_json,
        errors: @job.errors.full_messages
      }, status: :unprocessable_content
    end
  end

  def edit
    render inertia: "Admin/Jobs/Edit", props: {
      job: @job.as_json
    }
  end

  def update
    if @job.update(job_params)
      redirect_to admin_job_path(@job), notice: "Job updated successfully."
    else
      render inertia: "Admin/Jobs/Edit", props: {
        job: @job.as_json,
        errors: @job.errors.full_messages
      }, status: :unprocessable_content
    end
  end

  def destroy
    @job.destroy
    redirect_to admin_jobs_path, notice: "Job deleted successfully."
  end

  private

  def set_job
    @job = Job.find(params[:id])
  end

  def job_params
    params.require(:job).permit(:title, :description, :budget, :due_date, :location, :parish_id, :client_id, :status, :supplier_profile_id)
  end

  def authorize_admin!
    unless current_user.admin?
      redirect_to root_path, alert: "Access denied. Only administrators can access this page."
    end
  end
end
