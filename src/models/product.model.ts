import {CategorieModel} from "@/models/categorie.model";
import {IngredientModel} from "@/models/ingredient.model";
import {ProductSizesModel} from "@/models/productSizes.model";

export interface ProductModel {
    id: string;
    name: string;
    description: string;
    type: string;
    image_urls: string[];
    categorieID: CategorieModel;
    isAvailable: boolean;
    Ingredients: IngredientModel[];
    cookingTime: number;
    productSizes: ProductSizesModel[];
    isDeleted: boolean;
    isActive: boolean;
    isFavorite: boolean;
    isVedette: boolean;
    isSelected: boolean;
    created_at: string;
}