import {ProductModel} from "@/models/product.model";

export interface RestaurantProductModel {
    id: number
    product: ProductModel
    isActive: boolean
    isDeleted: boolean
}