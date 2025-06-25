import {CategorieModel} from "@/models/categorie.model";
import {b} from "@fullcalendar/core/internal-common";

export interface RestaurantCategoryModel {
    id: string
    category: CategorieModel
    isActive: boolean
}