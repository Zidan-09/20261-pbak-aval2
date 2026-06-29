import { ExistsByDate } from "./exists-by-date";
import { GetHolidays } from "./get-holidays";
import { SaveHoliday } from "./save-holiday";

export interface HolidayRepository extends GetHolidays, ExistsByDate, SaveHoliday {

}