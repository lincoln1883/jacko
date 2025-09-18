# frozen_string_literal: true

class CreatePortfolioImages < ActiveRecord::Migration[8.0]
  def change
    create_table :portfolio_images do |t|
      t.references :trades_person_profile, null: false, foreign_key: true
      t.string :title, limit: 255
      t.text :description, limit: 1000
      t.integer :display_order, default: 0, null: false
      t.boolean :active, default: true, null: false
      t.string :image_alt_text, limit: 255
      t.json :metadata, default: "{}", null: false

      t.timestamps
    end

    add_index :portfolio_images, [:trades_person_profile_id, :active]
    add_index :portfolio_images, [:trades_person_profile_id, :display_order]
    # Note: SQLite doesn't support GIN indexes, but regular index on text works
    add_index :portfolio_images, :metadata
  end
end
