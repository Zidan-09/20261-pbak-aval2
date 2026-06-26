import { FindTrip } from "./find-trip";
import { GetTrips } from "./get-trips";
import { SaveTrip } from "./save-trip";

export interface TripRepository extends SaveTrip, FindTrip, GetTrips {

}