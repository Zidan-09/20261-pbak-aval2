export type CreateTripRequestInput = {
    requesterName: string;
    origin: string;
    destination: string;
    departureAt: Date;
    returnAt: Date;
    purpose: string;
    passengerCount: number;
}