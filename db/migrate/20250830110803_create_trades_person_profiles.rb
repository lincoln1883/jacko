# frozen_string_literal: true

class CreateTradesPersonProfiles < ActiveRecord::Migration[8.0]
  def change
    create_table :trades_person_profiles do |t|
      t.references :user, null: false, foreign_key: true, index: {unique: true}
      t.text :bio
      t.string :company_name
      t.integer :years_experience, null: true, default: 0
      t.decimal :hourly_rate, precision: 8, scale: 2, null: true
      t.string :phone, limit: 20
      t.string :website, limit: 255
      t.integer :availability_status, null: false, default: 0
      t.text :description
      t.boolean :active, null: false, default: true
      t.datetime :profile_completed_at

      t.timestamps
    end

    add_index :trades_person_profiles, :availability_status
    add_index :trades_person_profiles, :active
    add_index :trades_person_profiles, :years_experience
  end
end
