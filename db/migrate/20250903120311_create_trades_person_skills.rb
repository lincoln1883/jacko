# frozen_string_literal: true

class CreateTradesPersonSkills < ActiveRecord::Migration[8.0]
  def change
    create_table :trades_person_skills do |t|
      t.references :trades_person_profile, null: false, foreign_key: true
      t.references :skill, null: false, foreign_key: true

      t.timestamps
    end

    add_index :trades_person_skills, [:trades_person_profile_id, :skill_id], unique: true, name: "index_profile_skills_unique"
  end
end
