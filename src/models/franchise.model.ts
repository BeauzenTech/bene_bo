import {UserModel} from "@/models/user.model";
import {RestaurantModel} from "@/models/restaurant.model";

export interface FranchiseModel {
    id: string;
    name: string;
    description: string;
    email: string;
    address: string;
    postalCode: string;
    phoneNumber: string;
    country: string;
    logo: string;
    is_active: boolean;
    isDeleted: boolean;
    restaurants: RestaurantModel[];
    ownerID: UserModel
}