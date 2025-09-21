# frozen_string_literal: true

class RemoveSupplierIdFromBids < ActiveRecord::Migration[8.0]
  def change
    remove_reference :bids, :supplier, foreign_key: {to_table: :users}
  end
end
