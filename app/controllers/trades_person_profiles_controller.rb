# frozen_string_literal: true

class TradesPersonProfilesController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_tradesperson!
  before_action :set_profile, only: [:show, :edit, :update]
  before_action :authorize_profile_access!, only: [:edit, :update]

  def show
    render inertia: "Profile/TradesPersonShow", props: {
      profile: serialize_profile(@profile),
      user: serialize_user(current_user),
      can_edit: can_edit_profile?
    }
  end

  def edit
    render inertia: "Profile/TradesPersonEdit", props: {
      profile: serialize_profile(@profile),
      user: serialize_user(current_user),
      errors: {}
    }
  end

  def update
    if @profile.update(profile_params)
      @profile.mark_as_completed!
      render inertia: "Profile/TradesPersonShow", props: {
        profile: serialize_profile(@profile.reload),
        user: serialize_user(current_user),
        can_edit: can_edit_profile?,
        flash: {success: "Profile updated successfully!"}
      }
    else
      render inertia: "Profile/TradesPersonEdit", props: {
        profile: serialize_profile(@profile),
        user: serialize_user(current_user),
        errors: @profile.errors.as_json
      }, status: :unprocessable_entity
    end
  end

  private

  def set_profile
    @profile = current_user.trades_person_profile

    unless @profile
      @profile = current_user.create_trades_person_profile!
    end
  end

  def ensure_tradesperson!
    unless current_user.tradesperson?
      redirect_to root_path, alert: "Access denied. Only tradespeople can access this page."
    end
  end

  def authorize_profile_access!
    # For now, users can only edit their own profiles
    # Later we might add admin access
    return if @profile.user == current_user

    redirect_to profile_tradesperson_path, alert: "You can only edit your own profile."
  end

  def can_edit_profile?
    @profile.user == current_user
  end

  def profile_params
    params.require(:trades_person_profile).permit(
      :bio,
      :company_name,
      :years_experience,
      :hourly_rate,
      :phone,
      :website,
      :availability_status,
      :description
    )
  end

  def serialize_profile(profile)
    return {} unless profile

    {
      id: profile.id,
      bio: profile.bio,
      company_name: profile.company_name,
      years_experience: profile.years_experience,
      hourly_rate: profile.hourly_rate,
      phone: profile.phone,
      website: profile.website,
      availability_status: profile.availability_status,
      description: profile.description,
      active: profile.active,
      completion_percentage: profile.completion_percentage,
      completed: profile.completed?,
      display_hourly_rate: profile.display_hourly_rate,
      display_experience: profile.display_experience,
      display_availability: profile.display_availability,
      availability_color: profile.availability_color,
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
