# frozen_string_literal: true

class ClientProfilesController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_client!
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
