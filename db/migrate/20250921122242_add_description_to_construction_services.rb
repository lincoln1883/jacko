# frozen_string_literal: true

class AddDescriptionToConstructionServices < ActiveRecord::Migration[8.0]
  def change
    add_column :construction_services, :description, :text
  end
end
