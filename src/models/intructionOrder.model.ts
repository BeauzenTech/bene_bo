import {ZoneModel} from "@/models/zone.model";

export interface InstructionOrderModel {
    demandeCouverts: boolean;
    quantityCouverts: string
    delaiRecuperation: string
    isTrancher: boolean
    cuisson: string
}