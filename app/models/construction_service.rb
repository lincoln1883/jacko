# frozen_string_literal: true

class ConstructionService < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :unit, presence: true
  validates :price, presence: true, numericality: {greater_than_or_equal_to: 0}
  validates :category, presence: true
end
