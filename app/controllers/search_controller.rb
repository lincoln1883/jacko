# frozen_string_literal: true

require "ostruct"

class SearchController < ApplicationController
  before_action :authenticate_user!

  def index
    # Main search page with search form
    render inertia: "Search/Index", props: {
      skills_by_category: skills_by_category,
      availability_options: availability_options,
      experience_options: experience_options
    }
  end

  def tradespeople
    @search_params = search_params
    @paginated_result = search_tradespeople(@search_params)

    render inertia: "Search/Tradespeople", props: {
      profiles: format_profiles(@paginated_result.records),
      search_params: @search_params,
      skills_by_category: skills_by_category,
      availability_options: availability_options,
      experience_options: experience_options,
      pagination: pagination_meta(@paginated_result)
    }
  end

  private

  def search_params
    params.permit(:query, :page, :per_page, skill_ids: [], availability: [], experience_range: [])
  end

  def search_tradespeople(search_params)
    base_query = TradesPersonProfile.active.completed

    # Start with a subquery for skill filtering if needed
    if search_params[:skill_ids].present? && search_params[:skill_ids].any?
      skill_ids = search_params[:skill_ids].reject(&:blank?).map(&:to_i)
      if skill_ids.any?
        skill_filtered = base_query
          .joins(:trades_person_skills)
          .where(trades_person_skills: {skill_id: skill_ids})
          .group("trades_person_profiles.id")
          .having("COUNT(DISTINCT trades_person_skills.skill_id) = ?", skill_ids.size)

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
        avatar_thumbnail_url: profile.avatar_thumbnail_url
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
