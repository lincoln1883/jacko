# frozen_string_literal: true

class CreateVerificationRequests < ActiveRecord::Migration[8.0]
  def change
    create_table :verification_requests do |t|
      t.references :supplier, null: false, foreign_key: {to_table: :users}
      t.integer :status, default: 0
      t.text :notes

      t.timestamps
    end
    add_index :verification_requests, :status
  end
end
