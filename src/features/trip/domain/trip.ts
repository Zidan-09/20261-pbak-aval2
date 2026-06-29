import { randomUUID } from "crypto";
import { TripRequestAlreadyCanceledError } from "./error/trip-already-canceled-error";
import { TripStatus } from "./tripStatus";

export class Trip {
    constructor(
        private readonly id: string,
        private readonly requesterName: string,
        private readonly origin: string,
        private readonly destination: string,
        private readonly departureAt: Date,
        private readonly returnAt: Date,
        private readonly purpose: string,
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

    public static create(
        requesterName: string,
        origin: string,
        destination: string,
        departureAt: Date,
        returnAt: Date,
        purpose: string,
        passengerCount: number
    ): Trip {
        return new Trip(
            randomUUID(),
            requesterName,
            origin,
            destination,
            departureAt,
            returnAt,
            purpose,
            passengerCount,
            TripStatus.PENDING,
            new Date()
        );
    }

    public static restore(
        id: string,
        requesterName: string,
        origin: string,
        destination: string,
        departureAt: Date,
        returnAt: Date,
        purpose: string,
        passengerCount: number,
        status: TripStatus,
        createdAt: Date
    ): Trip {
        return new Trip(
            id,
            requesterName,
            origin,
            destination,
            departureAt,
            returnAt,
            purpose,
            passengerCount,
            status,
            createdAt
        );
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

    public cancel(): void {
        if (this.status === TripStatus.CANCELED) throw new TripRequestAlreadyCanceledError();

        this.status = TripStatus.CANCELED;
    }
}