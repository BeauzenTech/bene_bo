import {UserModel} from "@/models/user.model";
import {OrderModel} from "@/models/order.model";

export interface PaymentModel {
    id: string;
    userID: UserModel
    amount: number;
    paymentMethod: string;
    transaction_id: string;
    orderSelf: OrderModel
    status: string;
    created_at: string;
}