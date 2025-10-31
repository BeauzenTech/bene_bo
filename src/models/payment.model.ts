import {UserModel} from "@/models/user.model";
import {OrderModel} from "@/models/order.model";
import {RestaurantModel} from "@/models/restaurant.model";

export interface PaymentModel {
    id: string;
    transactionId: string;
    orderId: string;
    amount: string;
    currency: string;
    status: string;
    paymentMethod: string;
    paymentReference: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    notes: string;
    metadata: any;
    isArchived: boolean;
    archivedAt: string | null;
    completedAt: string | null;
    failedAt: string | null;
    user: UserModel;
    userId: string;
    order: OrderModel | null;
    restaurant: RestaurantModel;
    restaurantId: string;
    created_at: string;
    updated_at: string;
}