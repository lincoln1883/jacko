# frozen_string_literal: true

class BidsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_supplier!, only: [:new, :create]
  before_action :set_job, only: [:new, :create, :update]
  before_action :set_bid, only: [:update]
  before_action :authorize_bid_action!, only: [:update]

  def new
    @bid = @job.bids.build
    render inertia: "Bids/New", props: {
      job: @job.as_json(only: [:id, :title, :budget]),
      bid: @bid.as_json,
      errors: {}
    }
  end

  def create
    @bid = @job.bids.build(bid_params)
    @bid.supplier_profile = current_user.supplier_profile # Changed to use supplier_profile

    if @bid.save
      redirect_to job_path(@job), notice: "Your bid has been placed successfully!"
    else
      render inertia: "Bids/New", props: {
        job: @job.as_json(only: [:id, :title, :budget]),
        bid: @bid.as_json,
        errors: @bid.errors.as_json
      }, status: :unprocessable_content
    end
  end

  def update
    new_status = params[:status]
    if @bid.update(status: new_status)
      if new_status == "accepted"
        @job.update(status: :in_progress)
        # Reject all other pending bids for this job
        @job.bids.where(status: :pending).where.not(id: @bid.id).update_all(status: :rejected)
        redirect_to job_path(@job), notice: "Bid accepted and job status updated!"
      elsif new_status == "rejected"
        redirect_to job_path(@job), notice: "Bid rejected!"
      else
        redirect_to job_path(@job), alert: "Invalid bid status update."
      end
    else
      redirect_to job_path(@job), alert: "Failed to update bid status."
    end
  end

  private

  def set_job
    @job = Job.find(params[:job_id])
  end

  def set_bid
    @bid = @job.bids.find(params[:id])
  end

  def bid_params
    params.require(:bid).permit(:amount, :message, :status)
  end

  def authorize_supplier!
    unless current_user.supplier? || current_user.contractor?
      redirect_to root_path, alert: "Access denied. Only suppliers or contractors can place bids."
    end
  end

  def authorize_bid_action!
    unless current_user.client? && @job.client_id == current_user.id
      redirect_to job_path(@job), alert: "Access denied. Only the job client can perform this action."
    end
  end
end
