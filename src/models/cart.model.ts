import {ZoneModel} from "@/models/zone.model";
import {IngredientModel} from "@/models/ingredient.model";
import {ProductModel} from "@/models/product.model";
import {ProductSizesModel} from "@/models/productSizes.model";

export interface CartModel {
    product_id: ProductModel;
    specification_id: ProductSizesModel;
    quantity: number;
    ingredient: IngredientModel[];
}