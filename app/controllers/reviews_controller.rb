# frozen_string_literal: true

class ReviewsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_job, only: [:new, :create]
  before_action :authorize_review_creation!, only: [:new, :create]

  def new
    # Determine who is being reviewed based on the current user's role and the job's client/supplier
    if current_user.client?
      @reviewee = @job.bids.accepted.first&.supplier_profile&.user # Changed to use supplier_profile.user
    elsif current_user.supplier? || current_user.contractor?
      @reviewee = @job.client
    end

    if @reviewee.nil?
      redirect_to job_path(@job), alert: "Cannot review at this time. The job might not be completed or no accepted bid exists."
      return
    end

    @review = @job.reviews.build(reviewer: current_user, reviewee: @reviewee)
    render inertia: "Reviews/New", props: {
      job: @job.as_json(only: [:id, :title]),
      review: @review.as_json(include: [:reviewee]),
      errors: {}
    }
  end

  def create
    # Re-determine reviewee to build the review correctly on submission
    if current_user.client?
      reviewee_user = @job.bids.accepted.first&.supplier_profile&.user # Changed to use supplier_profile.user
    elsif current_user.supplier? || current_user.contractor?
      reviewee_user = @job.client
    end

    @review = @job.reviews.build(review_params)
    @review.reviewer = current_user
    @review.reviewee = reviewee_user

    if @review.save
      redirect_to job_path(@job), notice: "Review submitted successfully!"
    else
      render inertia: "Reviews/New", props: {
        job: @job.as_json(only: [:id, :title]),
        review: @review.as_json(include: [:reviewee]),
        errors: @review.errors.as_json
      }, status: :unprocessable_content
    end
  end

  private

  def set_job
    @job = Job.find(params[:job_id])
  end

  def review_params
    params.require(:review).permit(:rating, :comment)
  end

  def authorize_review_creation!
    # A review can only be left if the job is completed
    unless @job.completed?
      redirect_to job_path(@job), alert: "You can only review completed jobs."
      return
    end

    # A client can review the accepted supplier, and a supplier can review the client
    if current_user.client?
      accepted_bid = @job.bids.accepted.first
      unless accepted_bid && current_user.id == @job.client_id
        redirect_to job_path(@job), alert: "You are not authorized to review this job."
        return
      end
      # Ensure client hasn't already reviewed this supplier for this job
      if Review.exists?(job: @job, reviewer: current_user, reviewee: accepted_bid.supplier_profile.user) # Changed to use supplier_profile.user
        redirect_to job_path(@job), alert: "You have already reviewed this supplier for this job."
        nil
      end
    elsif current_user.supplier? || current_user.contractor?
      unless @job.bids.accepted.exists?(supplier: current_user) || current_user.id == @job.client_id # Allow contractors who are clients to review
        redirect_to job_path(@job), alert: "You are not authorized to review this job."
        return
      end
      # Ensure supplier hasn't already reviewed this client for this job
      if Review.exists?(job: @job, reviewer: current_user, reviewee: @job.client)
        redirect_to job_path(@job), alert: "You have already reviewed this client for this job."
        nil
      end
    else
      redirect_to job_path(@job), alert: "You are not authorized to review this job."
    end
  end
end
