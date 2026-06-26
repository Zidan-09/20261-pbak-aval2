import { FindTrip } from "./find-trip";
import { SaveTrip } from "./save-trip";

export interface TripRepository extends SaveTrip, FindTrip {

}