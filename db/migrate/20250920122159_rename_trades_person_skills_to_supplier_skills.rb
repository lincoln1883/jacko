# frozen_string_literal: true

class RenameTradesPersonSkillsToSupplierSkills < ActiveRecord::Migration[8.0]
  def change
    rename_column :trades_person_skills, :trades_person_profile_id, :supplier_profile_id
    rename_table :trades_person_skills, :supplier_skills
  end
end
