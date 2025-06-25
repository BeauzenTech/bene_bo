import {UserModel} from "@/models/user.model";

export interface CustomerModel{
    id: string
    firstName: string
    lastName: string
    phoneNumber: string
    address: string
    email: string
    city: string
    codePostal: string
    batiment: string
    rue: string
    created_at: string
    user: UserModel
    civilite: string
    npa: string
    localite: string
    numeroRue: string
    remarqueCommande: string[],
    typesCommandes: string[],
    demandeCouverts: number[],
    moyenPaiements: string[],
    type: string,
    listeCuisson: string[]
    promotions: boolean
    newsletter: boolean
}

