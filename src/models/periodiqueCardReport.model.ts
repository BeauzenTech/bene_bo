import {cardReport} from "@/models/cardReport.model";

export interface PeriodiqueCardReport {
    currentWeek: cardReport
    lastWeek: cardReport
    currentMonth: cardReport
    lastMonth: cardReport
    year: cardReport
}