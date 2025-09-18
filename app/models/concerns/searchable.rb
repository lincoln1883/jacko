# frozen_string_literal: true

module Searchable
  extend ActiveSupport::Concern

  included do
    scope :with_skills, ->(skill_ids) {
      joins(:trades_person_skills)
        .where(trades_person_skills: {skill_id: skill_ids})
        .group("trades_person_profiles.id")
        .having("COUNT(DISTINCT trades_person_skills.skill_id) = ?", skill_ids.size)
    }

    scope :search_by_text, ->(query) {
      where(
        "trades_person_profiles.bio LIKE :query OR
         trades_person_profiles.description LIKE :query OR
         trades_person_profiles.company_name LIKE :query",
        query: "%#{query}%"
      )
    }
  end
end
