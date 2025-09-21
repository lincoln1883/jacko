# frozen_string_literal: true

class CreateReviews < ActiveRecord::Migration[8.0]
  def change
    create_table :reviews do |t|
      t.references :job, null: false, foreign_key: true
      t.references :reviewer, null: false, foreign_key: {to_table: :users}
      t.references :reviewee, null: false, foreign_key: {to_table: :users}
      t.integer :rating
      t.text :comment

      t.timestamps
    end
    add_index :reviews, :rating
  end
end
