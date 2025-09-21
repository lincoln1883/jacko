# frozen_string_literal: true

class AddSupplierProfileToBids < ActiveRecord::Migration[8.0]
  def change
    add_reference :bids, :supplier_profile, null: false, foreign_key: {to_table: :supplier_profiles}
  end
end
