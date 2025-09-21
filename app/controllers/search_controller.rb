# frozen_string_literal: true

require "ostruct"

class SearchController < ApplicationController
  before_action :authenticate_user!

  def index
    # Main search page with search form
    render inertia: "Search/Index", props: {
      skills_by_category: skills_by_category,
      availability_options: availability_options,
      experience_options: experience_options,
      parish_options: parish_options # New: Pass parish options
    }
  end

  def suppliers
    @search_params = search_params
    @paginated_result = search_suppliers(@search_params)

    render inertia: "Search/Suppliers", props: {
      profiles: format_profiles(@paginated_result.records),
      search_params: @search_params,
      skills_by_category: skills_by_category,
      availability_options: availability_options,
      experience_options: experience_options,
      parish_options: parish_options, # New: Pass parish options
      pagination: pagination_meta(@paginated_result)
    }
  end

  private

  def search_params
    params.permit(
      :query,
      :page,
      :per_page,
      :parish_id,
      :service_radius_km,
      skill_ids: [],
      availability: [],
      experience_range: []
    )
  end

  def search_suppliers(search_params)
    base_query = SupplierProfile.active.completed.includes(:parish)

    # Start with a subquery for skill filtering if needed
    if search_params[:skill_ids].present? && search_params[:skill_ids].any?
      skill_ids = search_params[:skill_ids].reject(&:blank?).map(&:to_i)
      if skill_ids.any?
        skill_filtered = base_query
          .joins(:supplier_skills)
          .where(supplier_skills: {skill_id: skill_ids})
          .group("supplier_profiles.id")
          .having("COUNT(DISTINCT supplier_skills.skill_id) = ?", skill_ids.size)

        base_query = base_query.where(id: skill_filtered)
      end
    end

    # Now build the main query with avatar preloading for performance
    profiles = base_query.includes(:user, :skills, avatar_attachment: :blob)

    # Text search in bio, description, and company name
    profiles = profiles.search_by_text(search_params[:query]) if search_params[:query].present?

    # Filter by availability status
    if search_params[:availability].present? && search_params[:availability].any?
      availability_statuses = search_params[:availability].reject(&:blank?)
      profiles = profiles.where(availability_status: availability_statuses) if availability_statuses.any?
    end

    # Filter by experience range
    if search_params[:experience_range].present? && search_params[:experience_range].any?
      experience_filters = search_params[:experience_range].reject(&:blank?)

      experience_filters.each do |filter|
        case filter
        when "entry_level"
          profiles = profiles.where("years_experience >= 0 AND years_experience <= 2")
        when "experienced"
          profiles = profiles.where("years_experience >= 3 AND years_experience <= 7")
        when "senior"
          profiles = profiles.where("years_experience >= 8 AND years_experience <= 15")
        when "expert"
          profiles = profiles.where("years_experience >= 16")
        end
      end
    end

    # New: Filter by parish_id
    if search_params[:parish_id].present?
      profiles = profiles.where(parish_id: search_params[:parish_id].to_i)
    end

    # New: Filter by service_radius_km
    if search_params[:service_radius_km].present?
      radius = search_params[:service_radius_km].to_i
      # This needs more advanced geographical search, but for now, we'll assume a simple filter.
      # For a real implementation, you'd use a gem like Geocoder or PostGIS.
      # For simplicity, we'll filter for profiles that have a service_radius_km greater than or equal to the search radius
      # This is a very basic interpretation and would ideally involve actual distance calculations.
      profiles = profiles.where("service_radius_km >= ?", radius)
    end

    # Pagination
    page = search_params[:page]&.to_i || 1
    per_page = search_params[:per_page]&.to_i || 12
    per_page = 50 if per_page > 50 # Cap at 50 results per page

    offset = (page - 1) * per_page

    # Get total count for pagination
    total_count = profiles.count

    # Apply pagination
    paginated_profiles = profiles.limit(per_page).offset(offset)

    # Create a simple pagination object
    OpenStruct.new(
      current_page: page,
      per_page: per_page,
      total_count: total_count,
      total_pages: (total_count.to_f / per_page).ceil,
      prev_page: page > 1 ? page - 1 : nil,
      next_page: page < (total_count.to_f / per_page).ceil ? page + 1 : nil,
      limit_value: per_page,
      records: paginated_profiles
    )
  end

  def format_profiles(profiles)
    profiles.map do |profile|
      {
        id: profile.id,
        user: {
          id: profile.user.id,
          email: profile.user.email
        },
        bio: profile.bio,
        company_name: profile.company_name,
        description: profile.description,
        years_experience: profile.years_experience,
        hourly_rate: profile.hourly_rate,
        phone: profile.phone,
        website: profile.website,
        availability_status: profile.availability_status,
        skills: profile.skills.map do |skill|
          {
            id: skill.id,
            name: skill.name,
            category: skill.category,
            category_color: skill.category_color
          }
        end,
        display_hourly_rate: profile.display_hourly_rate,
        display_experience: profile.display_experience,
        display_availability: profile.display_availability,
        availability_color: profile.availability_color,
        completion_percentage: profile.completion_percentage,
        skill_names: profile.skill_names,
        primary_skills: profile.primary_skills.map do |skill|
          {
            id: skill.id,
            name: skill.name,
            category: skill.category,
            category_color: skill.category_color
          }
        end,
        has_avatar: profile.has_avatar?,
        avatar_url: profile.avatar_url,
        avatar_thumbnail_url: profile.avatar_thumbnail_url,
        parish: profile.parish ? {id: profile.parish.id, name: profile.parish.name} : nil, # Include parish data
        street_address: profile.street_address,
        city_town: profile.city_town,
        postal_code: profile.postal_code,
        service_radius_km: profile.service_radius_km,
        service_area_notes: profile.service_area_notes,
        additional_parishes: profile.additional_parishes
      }
    end
  end

  def skills_by_category
    @skills_by_category ||= Skill.active.group_by(&:category).transform_values do |skills|
      skills.map { |skill| {id: skill.id, name: skill.name, description: skill.description} }
    end
  end

  def availability_options
    [
      {value: "available", label: "Available for new projects", color: "green"},
      {value: "busy", label: "Busy but accepting inquiries", color: "yellow"},
      {value: "unavailable", label: "Currently unavailable", color: "red"},
      {value: "booked", label: "Fully booked", color: "red"}
    ]
  end

  def experience_options
    [
      {value: "entry_level", label: "Entry Level (0-2 years)"},
      {value: "experienced", label: "Experienced (3-7 years)"},
      {value: "senior", label: "Senior (8-15 years)"},
      {value: "expert", label: "Expert (16+ years)"}
    ]
  end

  def parish_options
    Parish.all.map { |parish| {value: parish.id, label: parish.name} }
  end

  def pagination_meta(paginated_result)
    {
      current_page: paginated_result.current_page,
      next_page: paginated_result.next_page,
      prev_page: paginated_result.prev_page,
      total_pages: paginated_result.total_pages,
      total_count: paginated_result.total_count,
      per_page: paginated_result.per_page
    }
  end
end
