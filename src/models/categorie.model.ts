import {ZoneModel} from "@/models/zone.model";

export interface CategorieModel {
    id: string;
    name: string;
    description: string;
    icone: string;
    isActive: boolean;
    created_at: string
}