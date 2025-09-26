# frozen_string_literal: true

class SupplierProfilesController < ApplicationController
  before_action :authenticate_user!, except: [:public_show]
  before_action :ensure_supplier_or_allow_switch!, only: [:edit]
  before_action :ensure_supplier!, except: [:edit, :public_show]
  before_action :set_profile, only: [:show, :edit, :update]
  before_action :set_public_profile, only: [:public_show]
  before_action :authorize_profile_access!, only: [:edit, :update]

  def show
    render inertia: "Profile/SupplierShow", props: {
      profile: serialize_profile(@profile),
      user: serialize_user(current_user),
      can_edit: can_edit_profile?,
      reviews: @profile.user.received_reviews.includes(:reviewer).as_json(include: {reviewer: {only: [:id, :email, :role_display]}}),
      completedJobs: @profile.user.supplier_jobs.completed.as_json(include: [:client, :parish]) # Fetch completed jobs where supplier is assigned
    }
  end

  def edit
    # Handle role switch if requested
    if params[:switch_role] == "true" && current_user.client?
      handle_role_switch_to_supplier
      return
    end

    render inertia: "Profile/SupplierEdit", props: {
      profile: serialize_profile(@profile),
      user: serialize_user(current_user),
      skills: serialize_skills,
      skills_by_category: skills_by_category_hash,
      parishes: serialize_parishes(Parish.all), # Pass all parishes
      errors: {}
    }
  end

  def update
    if @profile.update(profile_params)
      @profile.mark_as_completed!
      render inertia: "Profile/SupplierShow", props: {
        profile: serialize_profile(@profile.reload),
        user: serialize_user(current_user),
        can_edit: can_edit_profile?,
        flash: {success: "Profile updated successfully!"}
      }
    else
      render inertia: "Profile/SupplierEdit", props: {
        profile: serialize_profile(@profile),
        user: serialize_user(current_user),
        skills: serialize_skills,
        skills_by_category: skills_by_category_hash,
        parishes: serialize_parishes(Parish.all), # Re-pass parishes on error
        errors: @profile.errors.as_json
      }, status: :unprocessable_content
    end
  end

  def public_show
    # Public view of any supplier's profile
    render inertia: "Profile/SupplierPublic", props: {
      profile: serialize_public_profile(@public_profile),
      profile_owner: serialize_profile_owner(@public_profile.user),
      can_edit: false,
      current_user: current_user ? serialize_user(current_user) : nil
    }
  end

  private

  def set_profile
    @profile = current_user.supplier_profile

    unless @profile
      # Ensure we have a default parish for profile creation in tests and dev
      default_parish = Parish.first || Parish.create!(name: "Kingston", code: "KIN", active: true)
      @profile = current_user.create_supplier_profile!(parish: default_parish, experience_level: :graduate)
    end

    # Preload avatar for better performance
    @profile = SupplierProfile.includes(avatar_attachment: :blob, parish: [])
                                  .find(@profile.id) if @profile
  end

  def set_public_profile
    @public_profile = SupplierProfile.active
                                         .completed
                                         .includes(:parish, :skills,
                                                  portfolio_images: {image_attachment: :blob},
                                                  avatar_attachment: :blob)
                                         .find(params[:id])
  rescue ActiveRecord::RecordNotFound
    redirect_to search_path, alert: "Profile not found or not available for public viewing."
  end

  def ensure_supplier!
    unless current_user.supplier? || current_user.contractor?
      redirect_to root_path, alert: "Access denied. Only suppliers or contractors can access this page."
    end
  end

  def ensure_supplier_or_allow_switch!
    # Allow client to access edit page if they want to switch roles
    return if current_user.supplier? || current_user.contractor?
    return if current_user.client? && params[:switch_role] == "true"

    redirect_to root_path, alert: "Access denied. Only suppliers or contractors can access this page."
  end

  def handle_role_switch_to_supplier
    # Switch user role from client to supplier
    current_user.update!(role: "supplier")

    # Clean up client profile if it exists
    current_user.client_profile&.destroy

    # Redirect to the supplier profile edit page without the switch parameter
    redirect_to edit_profile_supplier_path, notice: "Your account has been switched to Supplier. Please complete your supplier profile."
  end

  def authorize_profile_access!
    # For now, users can only edit their own profiles
    # Later we might add admin access
    return if @profile.user == current_user

    redirect_to profile_supplier_path, alert: "You can only edit your own profile."
  end

  def can_edit_profile?
    @profile.user == current_user
  end

  def profile_params
    params.require(:supplier_profile).permit(
      :bio,
      :company_name,
      :years_experience,
      :hourly_rate,
      :phone,
      :website,
      :availability_status,
      :description,
      :parish_id,
      :street_address,
      :city_town,
      :postal_code,
      :service_radius_km,
      :service_area_notes,
      additional_parishes: [],
      skill_ids: []
    )
  end

  def serialize_profile(profile)
    profile.as_json(methods: [
      :completion_percentage,
      :completed?,
      :display_hourly_rate,
      :display_experience,
      :display_availability,
      :availability_color,
      :experience_level,
      :skill_ids,
      :skills_by_category,
      :has_avatar?,
      :avatar_url,
      :avatar_thumbnail_url
    ],
    include: {
      parish: {only: [:id, :name]},
      skills: {only: [:id, :name, :category, :description, :category_color]}
    })
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

  def serialize_skills
    Skill.all.as_json(only: [:id, :name, :category, :description, :category_color])
  end

  def serialize_skill(skill)
    {
      id: skill.id,
      name: skill.name,
      category: skill.category,
      description: skill.description,
      category_color: skill.category_color
    }
  end

  def serialize_profile_skills(profile)
    profile.skills.map { |skill| serialize_skill(skill) }
  end

  def skills_by_category_hash
    Skill.all.group_by(&:category).transform_values do |skills|
      skills.as_json(only: [:id, :name, :category, :description, :category_color])
    end
  end

  def serialize_public_profile(profile)
    profile.as_json(methods: [
      :display_hourly_rate,
      :display_experience,
      :display_availability,
      :availability_color,
      :experience_level,
      :skill_ids,
      :skills_by_category,
      :has_avatar?,
      :avatar_url,
      :avatar_thumbnail_url,
      :average_rating,
      :review_count
    ],
    include: {
      parish: {only: [:id, :name]},
      skills: {only: [:id, :name, :category, :description, :category_color]},
      portfolio_images: {methods: [:image_url, :thumbnail_url, :file_size_mb, :image_alt_text], only: [:id, :title, :description, :active, :position]},
      user: {include: {received_reviews: {include: {reviewer: {only: [:id, :email, :role_display]}}}}}
    })
  end

  def serialize_profile_owner(user)
    user.as_json(only: [:id, :email, :role, :verified])
  end

  def serialize_portfolio_images(profile)
    profile.active_portfolio_images.map do |image|
      {
        id: image.id,
        title: image.title,
        description: image.description,
        alt_text: image.image_alt_text,
        display_order: image.display_order,
        image_url: image.image.attached? ? url_for(image.image) : nil,
        thumbnail_url: image.image.attached? ? url_for(image.image.variant(resize_to_limit: [300, 200])) : nil,
        created_at: image.created_at
      }
    end
  end

  def serialize_parish(parish)
    return nil unless parish

    {
      id: parish.id,
      name: parish.name,
      code: parish.code,
      main_city: parish.main_city,
      description: parish.description
    }
  end

  def serialize_location_info(profile)
    {
      street_address: profile.street_address,
      city_town: profile.city_town,
      postal_code: profile.postal_code,
      parish_name: profile.parish&.name,
      display_address: build_display_address(profile)
    }
  end

  def serialize_service_area(profile)
    {
      service_radius_km: profile.service_radius_km,
      service_area_notes: profile.service_area_notes,
      additional_parishes: profile.additional_parishes || [],
      coverage_description: build_coverage_description(profile)
    }
  end

  def build_display_address(profile)
    parts = []
    parts << profile.street_address if profile.street_address.present?
    parts << profile.city_town if profile.city_town.present?
    parts << profile.parish&.name if profile.parish
    parts << profile.postal_code if profile.postal_code.present?

    parts.any? ? parts.join(", ") : nil
  end

  def build_coverage_description(profile)
    return nil unless profile.service_radius_km.present? || profile.additional_parishes&.any?

    parts = []

    if profile.service_radius_km.present?
      parts << "#{profile.service_radius_km}km radius from #{profile.parish&.name || 'base location'}"
    end

    if profile.additional_parishes&.any?
      additional_names = Parish.where(code: profile.additional_parishes).pluck(:name)
      parts << "Also serves: #{additional_names.join(', ')}" if additional_names.any?
    end

    parts.join(" | ")
  end

  def serialize_parishes(parishes)
    parishes.as_json(only: [:id, :name, :svg_path, :color])
  end
end
