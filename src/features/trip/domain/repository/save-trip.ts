import { Trip } from "../trip";

export interface SaveTrip {
    save(trip: Trip): void;
}