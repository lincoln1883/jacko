# frozen_string_literal: true

class RenameTradesPersonProfilesToSupplierProfiles < ActiveRecord::Migration[8.0]
  def change
    rename_table :trades_person_profiles, :supplier_profiles
  end
end
