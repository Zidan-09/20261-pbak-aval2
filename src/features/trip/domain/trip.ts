import { InvalidStatusError } from "./error/invalidStatusError";
import { TripStatus } from "./tripStatus";

export class Trip {
    constructor(
        private readonly id: string,
        private readonly requesterName: string,
        private readonly origin: string,
        private readonly destination: string,
        private readonly departureAt: Date,
        private readonly returnAt: Date,
        private readonly purpose: unknown,
        private passengerCount: number,
        private status: TripStatus,
        private readonly createdAt: Date
    ) {
        this.id = id;
        this.requesterName = requesterName;
        this.origin = origin;
        this.destination = destination;
        this.departureAt = departureAt;
        this.returnAt = returnAt;
        this.purpose = purpose;
        this.passengerCount = passengerCount;
        this.status = status;
        this.createdAt = createdAt;
    }

    public getId(): string {
        return this.id;
    }

    public getRequesterName(): string {
        return this.requesterName;
    }

    public getOrigin(): string {
        return this.origin;
    }

    public getDestionation(): string {
        return this.destination;
    }

    public getDepartureDate(): Date {
        return this.departureAt;
    }

    public getReturnDate(): Date {
        return this.returnAt;
    }

    public getPurpose() {
        return this.purpose;
    }

    public getPassengerCount(): number {
        return this.passengerCount
    }

    public getStatus(): TripStatus {
        return this.status;
    }

    public getCreatedDate(): Date {
        return this.createdAt;
    }

    public changeStatus(status: TripStatus): void {
        if (this.status == status) throw new InvalidStatusError("can not change status to be the same");

        this.status = status;
    }
}