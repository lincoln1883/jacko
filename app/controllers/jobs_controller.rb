# frozen_string_literal: true

class JobsController < ApplicationController
  skip_before_action :authenticate, only: [:index, :show] # Added to skip global authentication
  before_action :authenticate_user!, except: [:index, :show]
  before_action :authorize_client!, only: [:new, :create, :edit, :update, :destroy]
  before_action :set_job, only: [:show, :edit, :update, :destroy]

  def index
    @jobs = Job.all

    if current_user&.supplier? || current_user&.contractor?
      if params[:parish_id].present?
        @jobs = @jobs.by_parish(params[:parish_id])
      end
    end

    if params[:status].present?
      @jobs = @jobs.where(status: Job.statuses[params[:status]])
    end

    render inertia: "Jobs/Index", props: {
      jobs: @jobs.as_json(include: :parish),
      parishes: Parish.all.as_json(only: [:id, :name]),
      selectedParishId: params[:parish_id].present? ? params[:parish_id].to_i : nil,
      selectedStatus: params[:status].presence,
      canPostJob: current_user&.client?
    }
  end

  def show
    render inertia: "Jobs/Show", props: {
      job: @job.as_json(include: [
        :client,
        :parish,
        bids: {include: :supplier}
      ])
    }
  end

  def new
    @job = Job.new
    render inertia: "Jobs/New", props: {
      job: @job.as_json,
      parishes: Parish.all.as_json(only: [:id, :name]),
      errors: {}
    }
  end

  def create
    @job = current_user.client_jobs.build(job_params)

    if @job.save
      redirect_to job_path(@job), notice: "Job posted successfully!"
    else
      render inertia: "Jobs/New", props: {
        job: @job.as_json,
        parishes: Parish.all.as_json(only: [:id, :name]),
        errors: @job.errors.as_json
      }, status: :unprocessable_content
    end
  end

  def edit
    render inertia: "Jobs/Edit", props: {
      job: @job.as_json,
      parishes: Parish.all.as_json(only: [:id, :name]),
      errors: {}
    }
  end

  def update
    if @job.update(job_params)
      redirect_to job_path(@job), notice: "Job updated successfully!"
    else
      render inertia: "Jobs/Edit", props: {
        job: @job.as_json,
        parishes: Parish.all.as_json(only: [:id, :name]),
        errors: @job.errors.as_json
      }, status: :unprocessable_content
    end
  end

  def destroy
    @job.destroy
    redirect_to jobs_path, notice: "Job deleted successfully!"
  end

  private

  def set_job
    @job = Job.find(params[:id])
  end

  def job_params
    params.require(:job).permit(:title, :description, :budget, :due_date, :location, :parish_id, :status)
  end

  def authorize_client!
    unless current_user.client?
      redirect_to root_path, alert: "Access denied. Only clients can post and manage jobs."
    end
  end
end
