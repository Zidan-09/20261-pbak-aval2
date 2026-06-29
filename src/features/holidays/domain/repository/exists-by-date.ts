import { Holiday } from "../holiday";

export interface ExistsByDate {
    existsByDate(date: Date): Promise<Holiday | null>;
}