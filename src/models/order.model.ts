import {FranchiseModel} from "@/models/franchise.model";
import {CodepostalModel} from "@/models/codepostal.model";
import {UserModel} from "@/models/user.model";
import {RestaurantModel} from "@/models/restaurant.model";
import {PaymentModel} from "@/models/payment.model";
import {OrderItemModel} from "@/models/orderItem.model";
import {InstructionOrderModel} from "@/models/instructionOrder.model";

export interface OrderModel {
    id: string;
    userID: UserModel;
    restaurantID: RestaurantModel;
    guest_first_name: string;
    guest_last_name: string;
    guest_email: string;
    guest_phone_number: string;
    status: string;
    total_price: number;
    payment_status: string;
    paymentID: PaymentModel;
    order_type: string;
    address: string;
    batiment: string;
    rue: string;
    estimated_delivery_time: number
    orderItems: OrderItemModel[];
    intructionOrder: InstructionOrderModel;
    created_at: string;


}