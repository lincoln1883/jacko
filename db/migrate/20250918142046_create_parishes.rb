# frozen_string_literal: true

class CreateParishes < ActiveRecord::Migration[8.0]
  def change
    create_table :parishes do |t|
      t.string :name, null: false
      t.string :code, null: false
      t.text :description
      t.boolean :active
      t.integer :population
      t.string :main_city
      t.decimal :latitude
      t.decimal :longitude
      t.string :svg_path
      t.string :color

      t.timestamps
    end
    add_index :parishes, :code, unique: true
  end
end
