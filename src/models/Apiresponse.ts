import {UserModel} from "@/models/user.model";
import {FranchiseModel} from "@/models/franchise.model";
import {RestaurantModel} from "@/models/restaurant.model";
import {OrderModel} from "@/models/order.model";
import {MethodePaiementModel} from "@/models/methodePaiement.model";
import {OrderTypeModel} from "@/models/orderType.model";
import {PaymentModel} from "@/models/payment.model";
import {CategorieModel} from "@/models/categorie.model";
import {IngredientModel} from "@/models/ingredient.model";
import {ProductModel} from "@/models/product.model";
import {CustomerModel} from "@/models/customer.model";
import {CampagneModel} from "@/models/campagne.model";
import {NotificationModel} from "@/models/notification.model";

export class ApiResponse<T> {
    code?: number;
    message?: string;
    data?: T;

    constructor(code?: number, message?: string, data?: T) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}


export interface PaginatedUsers {
    items: UserModel[];
    pagination: {
        current_page: number;
        total_items: number;
        total_pages: number;
        items_per_page: number;
    };
}

export interface PaginatedFrachises {
    items: FranchiseModel[];
    pagination: {
        current_page: number;
        total_items: number;
        total_pages: number;
        items_per_page: number;
    };
}

export interface PaginatedRestaurant {
    items: RestaurantModel[];
    pagination: {
        current_page: number;
        total_items: number;
        total_pages: number;
        items_per_page: number;
    };
}

export interface PaginatedOrder {
    items: OrderModel[];
    pagination: {
        current_page: number;
        total_items: number;
        total_pages: number;
        items_per_page: number;
    };
}

export interface PaginatedMethodePaiement {
    items: MethodePaiementModel[];
    pagination: {
        current_page: number;
        total_items: number;
        total_pages: number;
        items_per_page: number;
    };
}

export interface PaginatedOrderType {
    items: OrderTypeModel[];
    pagination: {
        current_page: number;
        total_items: number;
        total_pages: number;
        items_per_page: number;
    };
}

export interface PaginatedPayment {
    items: PaymentModel[];
    pagination: {
        current_page: number;
        total_items: number;
        total_pages: number;
        items_per_page: number;
    };
}

export interface PaginatedCategorie {
    items: CategorieModel[];
    pagination: {
        current_page: number;
        total_items: number;
        total_pages: number;
        items_per_page: number;
    };
}

export interface PaginatedIngredient {
    items: IngredientModel[];
    pagination: {
        current_page: number;
        total_items: number;
        total_pages: number;
        items_per_page: number;
    };
}

export interface PaginatedProduct {
    items: ProductModel[];
    pagination: {
        current_page: number;
        total_items: number;
        total_pages: number;
        items_per_page: number;
    };
}

export interface PaginatedCustomer {
    items: CustomerModel[];
    pagination: {
        current_page: number;
        total_items: number;
        total_pages: number;
        items_per_page: number;
    };
}

export interface PaginatedCampagne {
    items: CampagneModel[];
    pagination: {
        current_page: number;
        total_items: number;
        total_pages: number;
        items_per_page: number;
    };
}

export interface PaginatedNotification {
    items: NotificationModel[];
    pagination: {
        current_page: number;
        total_items: number;
        total_pages: number;
        items_per_page: number;
    };
}