import { HolidaySync } from "../holiday-sync";

export interface GetHolidaySync {
    get(year: number): Promise<HolidaySync | null>;
}