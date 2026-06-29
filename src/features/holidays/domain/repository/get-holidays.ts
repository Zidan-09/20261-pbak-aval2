import { Holiday } from "../holiday";

export interface GetHolidays {
   get(year: number): Promise<Holiday[]>;
}