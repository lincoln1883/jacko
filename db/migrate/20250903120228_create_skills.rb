# frozen_string_literal: true

class CreateSkills < ActiveRecord::Migration[8.0]
  def change
    create_table :skills do |t|
      t.string :name, null: false
      t.string :category, null: false
      t.text :description
      t.boolean :active, null: false, default: true

      t.timestamps
    end

    add_index :skills, :name, unique: true
    add_index :skills, :category
    add_index :skills, :active
  end
end
