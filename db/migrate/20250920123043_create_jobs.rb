# frozen_string_literal: true

class CreateJobs < ActiveRecord::Migration[8.0]
  def change
    create_table :jobs do |t|
      t.string :title
      t.text :description
      t.decimal :budget
      t.date :due_date
      t.string :location
      t.references :parish, null: false, foreign_key: true
      t.references :client, null: false, foreign_key: {to_table: :users}
      t.integer :status

      t.timestamps
    end
    add_index :jobs, :status
  end
end
