# frozen_string_literal: true

class DisputesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_job, only: [:new, :create]
  before_action :authorize_dispute_creation!, only: [:new, :create]

  def new
    @dispute = @job.disputes.build(reporter: current_user)
    render inertia: "Disputes/New", props: {
      job: @job.as_json(only: [:id, :title]),
      dispute: @dispute.as_json,
      errors: {},
      reportedUserOptions: reported_user_options
    }
  end

  def create
    @dispute = @job.disputes.build(dispute_params)
    @dispute.reporter = current_user

    if @dispute.save
      redirect_to job_path(@job), notice: "Dispute reported successfully!"
    else
      render inertia: "Disputes/New", props: {
        job: @job.as_json(only: [:id, :title]),
        dispute: @dispute.as_json,
        errors: @dispute.errors.as_json,
        reportedUserOptions: reported_user_options
      }, status: :unprocessable_content
    end
  end

  private

  def set_job
    @job = Job.find(params[:job_id])
  end

  def dispute_params
    params.require(:dispute).permit(:reported_user_id, :reason, :description)
  end

  def authorize_dispute_creation!
    # Only completed jobs can have disputes
    unless @job.completed?
      redirect_to job_path(@job), alert: "Disputes can only be reported for completed jobs."
      return
    end

    # Ensure the current user is either the client or the accepted supplier/contractor for the job
    is_client = current_user.id == @job.client_id
    accepted_supplier = @job.bids.accepted.first&.supplier_profile&.user # Changed to use supplier_profile.user
    is_accepted_supplier = accepted_supplier && current_user.id == accepted_supplier.id

    unless is_client || is_accepted_supplier
      redirect_to job_path(@job), alert: "You are not authorized to report a dispute for this job."
      return
    end

    # Prevent duplicate disputes from the same reporter for the same reported_user on the same job
    if params[:dispute].present? && Dispute.exists?(job: @job, reporter: current_user, reported_user_id: params[:dispute][:reported_user_id])
      redirect_to job_path(@job), alert: "You have already reported a dispute against this user for this job."
      nil
    end
  end

  def reported_user_options
    options = []

    # If current user is client, they can report the accepted supplier
    if current_user.client? && current_user.id == @job.client_id
      accepted_supplier = @job.bids.accepted.first&.supplier_profile&.user # Changed to use supplier_profile.user
      options << {label: accepted_supplier.email, value: accepted_supplier.id} if accepted_supplier
    end

    # If current user is accepted supplier/contractor, they can report the client
    accepted_bid_by_current_user = @job.bids.accepted.find_by(supplier_profile: current_user.supplier_profile) # Changed to use supplier_profile
    if accepted_bid_by_current_user
      options << {label: @job.client.email, value: @job.client.id}
    end
    options.uniq
  end
end
