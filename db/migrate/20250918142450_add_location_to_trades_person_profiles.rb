# frozen_string_literal: true

class AddLocationToTradesPersonProfiles < ActiveRecord::Migration[8.0]
  def change
    add_reference :trades_person_profiles, :parish, null: true, foreign_key: true
    add_column :trades_person_profiles, :street_address, :string
    add_column :trades_person_profiles, :city_town, :string
    add_column :trades_person_profiles, :postal_code, :string
    add_column :trades_person_profiles, :latitude, :decimal
    add_column :trades_person_profiles, :longitude, :decimal
    add_column :trades_person_profiles, :service_radius_km, :integer
    add_column :trades_person_profiles, :service_area_notes, :text
    add_column :trades_person_profiles, :additional_parishes, :json
  end
end
