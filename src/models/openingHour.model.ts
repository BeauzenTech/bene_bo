export interface OpeningHourModel {
  id: string;
  restaurantId: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  scheduleType: 'opening' | 'break';
  startTime: string;
  endTime: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOpeningHourRequest {
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  scheduleType: 'opening' | 'break';
  startTime: string;
  endTime: string;
  description?: string;
}

export interface BulkOpeningHoursRequest {
  restaurantId: string;
  schedules: CreateOpeningHourRequest[];
}

export interface FormattedOpeningHours {
  dayOfWeek: string;
  status: 'open' | 'closed' | 'partial';
  schedules: Array<{
    type: 'opening' | 'break';
    startTime: string;
    endTime: string;
    description?: string;
  }>;
}
