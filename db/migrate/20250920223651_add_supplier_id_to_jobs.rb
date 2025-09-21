# frozen_string_literal: true

class AddSupplierIdToJobs < ActiveRecord::Migration[8.0]
  def change
    add_reference :jobs, :supplier_profile, null: true, foreign_key: {to_table: :supplier_profiles}
  end
end
