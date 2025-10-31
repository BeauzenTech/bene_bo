export interface DeliveryZoneModel {
  id: string;
  name: string;
  minimumOrderAmount: number;
  deliveryFee?: number;
  description?: string;
  isActive: boolean;
  restaurantId: string;
  postalCodes: PostalCodeModel[];
  createdAt: string;
  updatedAt: string;
}

export interface PostalCodeModel {
  id: string;
  code: number;
  locality: string;
  isActive: boolean;
  zoneId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeliveryZoneRequest {
  name: string;
  minimumOrderAmount: number;
  deliveryFee?: number;
  description?: string;
}

export interface UpdateDeliveryZoneRequest {
  name?: string;
  minimumOrderAmount?: number;
  deliveryFee?: number;
  description?: string;
  isActive?: boolean;
}

export interface AddPostalCodeRequest {
  code: number;
  locality: string;
}

export interface UpdatePostalCodeRequest {
  locality?: string;
  isActive?: boolean;
}
