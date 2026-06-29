import { Holiday } from "../holiday";

export interface SaveHoliday {
    save(holiday: Holiday): Promise<void>;
    saveAll(holidays: Holiday[]): Promise<void>;
}