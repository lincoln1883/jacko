# frozen_string_literal: true

class VerificationRequestsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_supplier!, only: [:new, :create]
  before_action :set_verification_request, only: [:show]

  def new
    @verification_request = current_user.verification_requests.build
    render inertia: "VerificationRequests/New", props: {
      verificationRequest: @verification_request.as_json,
      errors: {}
    }
  end

  def create
    @verification_request = current_user.verification_requests.build(verification_request_params)

    if @verification_request.save
      redirect_to verification_request_path(@verification_request), notice: "Verification request submitted successfully!"
    else
      render inertia: "VerificationRequests/New", props: {
        verificationRequest: @verification_request.as_json,
        errors: @verification_request.errors.as_json
      }, status: :unprocessable_content
    end
  end

  def show
    render inertia: "VerificationRequests/Show", props: {
      verificationRequest: @verification_request.as_json(methods: [:document_urls], include: :supplier)
    }
  end

  private

  def set_verification_request
    @verification_request = VerificationRequest.find(params[:id])
  end

  def verification_request_params
    params.require(:verification_request).permit(:notes, documents: [])
  end

  def authorize_supplier!
    unless current_user.supplier? || current_user.contractor?
      redirect_to root_path, alert: "Access denied. Only suppliers or contractors can submit verification requests."
    end
  end
end
