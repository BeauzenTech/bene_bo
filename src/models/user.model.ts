import {FranchiseModel} from "@/models/franchise.model";

export interface UserModel {
    id: string;
    email: string;
    roles: UserRole[];
    first_name: string;
    last_name: string;
    phone_number: string | null;
    postal_code: string;
    profil_picture: string | null;
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    franchises: FranchiseModel[];

}

export type UserRole = 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_FRANCHISE' | 'ROLE_RESTAURANT'; // Ajoutez tous les rôles possibles

