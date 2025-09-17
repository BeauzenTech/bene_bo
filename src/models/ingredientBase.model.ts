export interface IngredientBaseModel {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateIngredientBaseRequest {
  name: string;
}

export interface UpdateIngredientBaseRequest {
  name: string;
}
