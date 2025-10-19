export interface IngredientBaseModel {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string | null;
  isActive: number;
  extra_cost_price?: string;
  type?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateIngredientBaseRequest {
  name: string;
  image_url?: string;
}

export interface UpdateIngredientBaseRequest {
  name: string;
  image_url?: string;
}
