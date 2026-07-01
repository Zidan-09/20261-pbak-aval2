import { describe, expect, it } from "vitest";

import { Trip } from "#/features/trip/domain/trip.ts";
import { TripStatus } from "#/features/trip/domain/tripStatus.ts";
import { TripRequestAlreadyCanceledError } from "#/features/trip/domain/error/trip-already-canceled-error.ts";

describe("Trip", () => {
    const createTrip = () => {
        return Trip.create(
            "Samuel Nascimento",
            "Teresina",
            "Fortaleza",
            new Date("2026-07-01T10:00:00.000Z"),
            new Date("2026-07-05T10:00:00.000Z"),
            "Academic event",
            10
        );
    };

    it("should create a trip with pending status and generated data", () => {
        const trip = createTrip();

        expect(trip.getId())
            .toEqual(expect.any(String));

        expect(trip.getRequesterName())
            .toBe("Samuel Nascimento");

        expect(trip.getOrigin())
            .toBe("Teresina");

        expect(trip.getDestionation())
            .toBe("Fortaleza");

        expect(trip.getDepartureDate())
            .toEqual(new Date("2026-07-01T10:00:00.000Z"));

        expect(trip.getReturnDate())
            .toEqual(new Date("2026-07-05T10:00:00.000Z"));

        expect(trip.getPurpose())
            .toBe("Academic event");

        expect(trip.getPassengerCount())
            .toBe(10);

        expect(trip.getStatus())
            .toBe(TripStatus.PENDING);

        expect(trip.getCreatedDate())
            .toEqual(expect.any(Date));
    });

    it("should restore a trip with the provided state", () => {
        const createdAt = new Date("2026-06-28T10:00:00.000Z");

        const trip = Trip.restore(
            "trip-1",
            "Samuel Nascimento",
            "Teresina",
            "Fortaleza",
            new Date("2026-07-01T10:00:00.000Z"),
            new Date("2026-07-05T10:00:00.000Z"),
            "Academic event",
            10,
            TripStatus.CANCELED,
            createdAt
        );

        expect(trip.getId())
            .toBe("trip-1");

        expect(trip.getRequesterName())
            .toBe("Samuel Nascimento");

        expect(trip.getOrigin())
            .toBe("Teresina");

        expect(trip.getDestionation())
            .toBe("Fortaleza");

        expect(trip.getDepartureDate())
            .toEqual(new Date("2026-07-01T10:00:00.000Z"));

        expect(trip.getReturnDate())
            .toEqual(new Date("2026-07-05T10:00:00.000Z"));

        expect(trip.getPurpose())
            .toBe("Academic event");

        expect(trip.getPassengerCount())
            .toBe(10);

        expect(trip.getStatus())
            .toBe(TripStatus.CANCELED);

        expect(trip.getCreatedDate())
            .toEqual(createdAt);
    });

    it("should cancel a pending trip", () => {
        const trip = createTrip();

        trip.cancel();

        expect(trip.getStatus())
            .toBe(TripStatus.CANCELED);
    });

    it("should throw when canceling an already canceled trip", () => {
        const trip = createTrip();

        trip.cancel();

        expect(() => trip.cancel())
            .toThrow(TripRequestAlreadyCanceledError);
    });
});
