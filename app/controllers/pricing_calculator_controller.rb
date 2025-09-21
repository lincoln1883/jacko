# frozen_string_literal: true

class PricingCalculatorController < ApplicationController
  skip_before_action :authenticate, only: [:show, :calculate] # Skip authentication

  def show
    @service_categories = ConstructionService.distinct.pluck(:category).sort
    @services_by_category = ConstructionService.all.group_by(&:category)

    render inertia: "PricingCalculator/Index", props: {
      serviceCategories: @service_categories,
      servicesByCategory: @services_by_category.transform_values do |services|
        services.as_json(only: [:id, :name, :unit, :price, :category])
      end,
      errors: {}
    }
  end

  def calculate
    total_cost = 0
    errors = {}

    params[:selected_services]&.each do |service_data|
      service_id = service_data[:id].to_i
      quantity = service_data[:quantity].to_d

      service = ConstructionService.find_by(id: service_id)

      if service && quantity > 0
        total_cost += service.price * quantity
      elsif !service
        errors[service_id] = ["Service not found."]
      elsif quantity <= 0
        errors[service_id] = ["Quantity must be positive."]
      end
    end

    if errors.empty?
      render json: {totalCost: total_cost.round(2)}
    else
      render json: {errors: errors}, status: :unprocessable_content
    end
  end
end
