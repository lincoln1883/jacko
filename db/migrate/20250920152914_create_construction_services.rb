# frozen_string_literal: true

class CreateConstructionServices < ActiveRecord::Migration[8.0]
  def change
    create_table :construction_services do |t|
      t.string :name
      t.string :unit
      t.decimal :price
      t.string :category

      t.timestamps
    end
  end
end
