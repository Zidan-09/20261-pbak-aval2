import { HolidaySync } from "../holiday-sync";

export interface SaveHolidaySync {
    save(holidaySync: HolidaySync): Promise<void>;
}