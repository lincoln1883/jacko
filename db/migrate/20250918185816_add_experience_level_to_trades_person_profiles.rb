# frozen_string_literal: true

class AddExperienceLevelToTradesPersonProfiles < ActiveRecord::Migration[8.0]
  def change
    add_column :trades_person_profiles, :experience_level, :integer
  end
end
