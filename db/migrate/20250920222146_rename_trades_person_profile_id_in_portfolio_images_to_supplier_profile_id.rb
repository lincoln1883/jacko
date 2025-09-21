# frozen_string_literal: true

class RenameTradesPersonProfileIdInPortfolioImagesToSupplierProfileId < ActiveRecord::Migration[8.0]
  def change
    rename_column :portfolio_images, :trades_person_profile_id, :supplier_profile_id
  end
end
