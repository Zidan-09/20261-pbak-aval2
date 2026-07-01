export type TripDto = {
    id: string;
    requesterName: string;
    origin: string;
    destination: string;
    departureAt: string;
    returnAt: string;
    purpose: string;
    passengerCount: number;
    status: "PENDING" | "CANCELED";
    createdAt: string;
}
