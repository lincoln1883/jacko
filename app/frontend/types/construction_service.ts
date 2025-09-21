export interface ConstructionService {
  id: number;
  name: string;
  unit: string;
  price: number;
  category: string;
}

export interface PricingCalculatorIndexProps {
  serviceCategories: string[];
  servicesByCategory: Record<string, ConstructionService[]>;
  errors?: Record<string, string[]>;
}

export interface SelectedService {
  id: number;
  quantity: number;
}

export interface CalculatedPriceResponse {
  totalCost: number;
  errors?: Record<string, string[]>;
}
