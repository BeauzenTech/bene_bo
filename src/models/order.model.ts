import { FranchiseModel } from "@/models/franchise.model";
import { CodepostalModel } from "@/models/codepostal.model";
import { UserModel } from "@/models/user.model";
import { RestaurantModel } from "@/models/restaurant.model";
import { PaymentModel } from "@/models/payment.model";
import { OrderItemModel } from "@/models/orderItem.model";
import { InstructionOrderModel } from "@/models/instructionOrder.model";
import { CustomerModel } from "@/models/customer.model";

export interface OrderModel {
  id: string;
  nif: string;
  transactionReference: string;
  order_type: string;
  status: string;
  total: string;
  created_at: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  delivery: {
    address: string;
    postal_code: string;
    locality: string;
    rue: string;
    numberRue: string;
  };
  payment: {
    method: string;
    status: string;
  };
  items: Array<{
    feature: any[];
    quantity: number;
    ingredient: any[];
    product_id: string;
    product_price: number;
    product_name: string;
    product_image: string[];
    optionSpecific: string;
    specification_id: string;
    removedIngredients: string[];
    size?: string;
    product?: {
      name: string;
      image_urls?: string[];
      image_url?: string[];
      categorieID?: {
        name: string;
      };
    };
  }>;
  // Propriétés optionnelles pour compatibilité
  userID?: UserModel;
  restaurantID?: RestaurantModel;
  guest_first_name?: string;
  guest_last_name?: string;
  guest_email?: string;
  guest_phone_number?: string;
  payment_status?: string;
  paymentID?: PaymentModel;
  address?: string;
  batiment?: string;
  rue?: string;
  estimated_delivery_time?: number;
  orderItems?: OrderItemModel[];
  intructionOrder?: InstructionOrderModel;
  civilite?: string;
  reference?: string;
  fraisLivraison?: string;
  taxe?: string;
  coupon?: string;
  DeliveryPreference?: string;
  SpecialInstructions?: string;
  timeOrder?: string;
  typeCustomer?: string;
  numberRue?: string;
  feature?: string[];
  deliveryLocality?: string;
  npa?: string;
  localite?: string;
  discountType?: string;
  discountValue?: string;
  restMinimumOrder?: string;
  divers?: string;
}
