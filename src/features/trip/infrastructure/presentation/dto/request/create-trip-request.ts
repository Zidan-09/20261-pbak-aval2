export type CreateTripRequestBody = {
    requesterName: string;
    origin: string;
    destination: string;
    departureAt: string;
    returnAt: string;
    purpose: string;
    passengerCount: number;
}
