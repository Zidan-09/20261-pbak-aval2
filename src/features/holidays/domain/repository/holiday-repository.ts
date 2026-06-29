import { GetHolidays } from "./get-holidays";
import { SaveHoliday } from "./save-holiday";

export interface HolidayRepository extends GetHolidays, SaveHoliday {

}