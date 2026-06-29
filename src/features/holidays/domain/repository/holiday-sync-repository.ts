import { GetHolidaySync } from "./get-holiday-sync";
import { SaveHolidaySync } from "./save-holiday-sync";

export interface HolidaySyncRepository extends SaveHolidaySync, GetHolidaySync {

}