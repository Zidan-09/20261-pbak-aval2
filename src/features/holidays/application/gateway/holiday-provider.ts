import { Holiday } from "../../domain/holiday";

export interface HolidayProvider {
    get(year: number): Promise<Holiday[]>;
}