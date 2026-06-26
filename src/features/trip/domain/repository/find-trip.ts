import { Trip } from "../trip";

export interface FindTrip {
    findById(id: string): Trip | null;
}