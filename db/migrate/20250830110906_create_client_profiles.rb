# frozen_string_literal: true

class CreateClientProfiles < ActiveRecord::Migration[8.0]
  def change
    create_table :client_profiles do |t|
      t.references :user, null: false, foreign_key: true, index: {unique: true}
      t.string :company_name, limit: 255
      t.integer :preferred_contact_method, null: false, default: 0
      t.string :project_budget_range, limit: 100
      t.text :description
      t.boolean :active, null: false, default: true
      t.datetime :profile_completed_at

      t.timestamps
    end

    add_index :client_profiles, :preferred_contact_method
    add_index :client_profiles, :active
  end
end
