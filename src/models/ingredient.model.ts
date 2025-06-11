import {IngredientSizeModel} from "@/models/ingredientSize.model";

export interface IngredientModel {
    id: string;
    name: string;
    imageUrl: string
    isAvailable: boolean;
    type: string;
    extra_cost_price: number;
    isDefault: boolean;
    quantite: number;
    ingredientSizes: IngredientSizeModel[];
}