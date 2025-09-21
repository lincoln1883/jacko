# frozen_string_literal: true

class CreateDisputes < ActiveRecord::Migration[8.0]
  def change
    create_table :disputes do |t|
      t.references :job, null: false, foreign_key: true
      t.references :reporter, null: false, foreign_key: {to_table: :users}
      t.references :reported_user, null: false, foreign_key: {to_table: :users}
      t.string :reason
      t.text :description
      t.integer :status, default: 0

      t.timestamps
    end
    add_index :disputes, :status
  end
end
