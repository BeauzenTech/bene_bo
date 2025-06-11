import {UserModel} from "@/models/user.model";

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
    restaurants: FranchiseModel[];
    ownerID: UserModel
}