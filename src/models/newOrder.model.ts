import {CartModel} from "@/models/cart.model";
import {InstructionOrderModel} from "@/models/intructionOrder.model";

export interface NewOrderModel {
    paniers: CartModel[]
    userID: string
    guest_first_name: string
    guest_last_name: string
    civilite: string
    guest_email: string
    guest_phone_number: string
    order_type: string
    payment_method: string,
    ville: string,
    addressLivraison: string
    batiment: string
    rue: string
    intructionOrder: InstructionOrderModel[]
}


