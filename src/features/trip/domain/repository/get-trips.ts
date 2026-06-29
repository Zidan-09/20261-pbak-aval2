import { Trip } from "../trip";

export interface GetTrips {
    getTripsByPage(page?: number, size?: number): Promise<Trip[]>;
}