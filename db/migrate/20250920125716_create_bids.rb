# frozen_string_literal: true

class CreateBids < ActiveRecord::Migration[8.0]
  def change
    create_table :bids do |t|
      t.references :job, null: false, foreign_key: true
      t.references :supplier, null: false, foreign_key: {to_table: :users}
      t.decimal :amount
      t.text :message
      t.integer :status

      t.timestamps
    end
    add_index :bids, :status
  end
end
