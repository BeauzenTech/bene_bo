import {FranchiseModel} from "@/models/franchise.model";
import {CodepostalModel} from "@/models/codepostal.model";
import {UserModel} from "@/models/user.model";

export interface RestaurantModel {
    id: string;
    franchiseID: FranchiseModel;
    name: string;
    email: string;
    phoneNumber: string;
    city: string;
    batiment: string;
    numeroRue: string;
    address: string;
    country: string
    isOpen: boolean;
    isDeleted: boolean
    is_active: boolean;
    codePostalID: CodepostalModel;
    created_at: string;
    userID: UserModel;
    taxe: string
}

