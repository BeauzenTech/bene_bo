export interface OpeningDayModel {
  id: string;
  restaurantId: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  status: 'open' | 'closed' | 'partial';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOpeningDayRequest {
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  status: 'open' | 'closed' | 'partial';
  description?: string;
}

export interface BulkOpeningDaysRequest {
  restaurantId: string;
  days: CreateOpeningDayRequest[];
}
