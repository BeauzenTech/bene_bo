import {ProductModel} from "@/models/product.model";
import {IngredientModel} from "@/models/ingredient.model";

export interface OrderItemModel {
    id: string;
    productID: ProductModel;
    quantity: number;
    unit_price: number;
    total_price: number;
    notes: string;
    optionSpecific: string;
    size: string;
    ingredients: IngredientModel[]
    created_at: string;

}