import {ZoneModel} from "@/models/zone.model";

export interface CodepostalModel {
    id: string;
    numeroPostal: string;
    ville: string;
    minimumCommandeAmount: string;
    zone: ZoneModel;
}