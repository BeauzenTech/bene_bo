import {UserModel} from "@/models/user.model";
import {OrderModel} from "@/models/order.model";
import { AdresseLocalModel } from "./adresseLocal.model";

export interface CustomerUser {
  created_at: string;
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  deviceToken: string;
  enableNotification: boolean;
  orders: OrderModel[]
  listeAdresses: AdresseLocalModel[]
}

export interface CustomerModel {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  city: string;
  codePostal: string | null;
  batiment: string;
  rue: string;
  user: CustomerUser;
  civilite: string;
  npa: string;
  localite: string;
  numeroRue: string | null;
  remarqueCommande: (string | null)[];
  promotions: boolean;
  newsletter: boolean;
  created_at: string;
  user_addresses?: any[];
}

export interface PaginatedCustomers {
  items: CustomerModel[];
  pagination?: {
    current_page: number;
    total_items: number;
    total_pages: number;
    items_per_page: number;
  };
}

