# frozen_string_literal: true

class ClientProfilesController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_client_or_allow_switch!, only: [:edit]
  before_action :ensure_client!, except: [:edit]
  before_action :set_profile, only: [:show, :edit, :update]
  before_action :authorize_profile_access!, only: [:edit, :update]

  def show
    render inertia: "Profile/ClientShow", props: {
      profile: serialize_profile(@profile),
      user: serialize_user(current_user),
      can_edit: can_edit_profile?
    }
  end

  def edit
    # Handle role switch if requested
    if params[:switch_role] == "true" && current_user.tradesperson?
      handle_role_switch_to_client
      return
    end

    render inertia: "Profile/ClientEdit", props: {
      profile: serialize_profile(@profile),
      user: serialize_user(current_user),
      contact_method_options: ClientProfile.contact_method_options,
      budget_range_options: ClientProfile.budget_range_options,
      errors: {}
    }
  end

  def update
    if @profile.update(profile_params)
      @profile.mark_as_completed!
      render inertia: "Profile/ClientShow", props: {
        profile: serialize_profile(@profile.reload),
        user: serialize_user(current_user),
        can_edit: can_edit_profile?,
        flash: {success: "Profile updated successfully!"}
      }
    else
      render inertia: "Profile/ClientEdit", props: {
        profile: serialize_profile(@profile),
        user: serialize_user(current_user),
        contact_method_options: ClientProfile.contact_method_options,
        budget_range_options: ClientProfile.budget_range_options,
        errors: @profile.errors.as_json
      }, status: :unprocessable_entity
    end
  end

  private

  def set_profile
    @profile = current_user.client_profile

    unless @profile
      @profile = current_user.create_client_profile!
    end
  end

  def ensure_client!
    unless current_user.client?
      redirect_to root_path, alert: "Access denied. Only clients can access this page."
    end
  end

  def ensure_client_or_allow_switch!
    # Allow tradesperson to access edit page if they want to switch roles
    return if current_user.client?
    return if current_user.tradesperson? && params[:switch_role] == "true"

    redirect_to root_path, alert: "Access denied. Only clients can access this page."
  end

  def handle_role_switch_to_client
    # Switch user role from tradesperson to client
    current_user.update!(role: "client")

    # Clean up tradesperson profile if it exists
    current_user.trades_person_profile&.destroy

    # Redirect to the client profile edit page without the switch parameter
    redirect_to edit_profile_client_path, notice: "Your account has been switched to Client. Please complete your client profile."
  end

  def authorize_profile_access!
    # For now, users can only edit their own profiles
    # Later we might add admin access
    return if @profile.user == current_user

    redirect_to profile_client_path, alert: "You can only edit your own profile."
  end

  def can_edit_profile?
    @profile.user == current_user
  end

  def profile_params
    params.require(:client_profile).permit(
      :company_name,
      :preferred_contact_method,
      :project_budget_range,
      :description
    )
  end

  def serialize_profile(profile)
    return {} unless profile

    {
      id: profile.id,
      company_name: profile.company_name,
      preferred_contact_method: profile.preferred_contact_method,
      project_budget_range: profile.project_budget_range,
      description: profile.description,
      active: profile.active,
      completion_percentage: profile.completion_percentage,
      completed: profile.completed?,
      display_budget_range: profile.display_budget_range,
      display_contact_method: profile.display_contact_method,
      created_at: profile.created_at,
      updated_at: profile.updated_at
    }
  end

  def serialize_user(user)
    {
      id: user.id,
      email: user.email,
      role: user.role,
      role_display: user.role_display,
      verified: user.verified
    }
  end
end
