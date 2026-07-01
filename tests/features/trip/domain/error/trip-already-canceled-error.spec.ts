import { describe, expect, it } from "vitest";

import { TripRequestAlreadyCanceledError } from "#/features/trip/domain/error/trip-already-canceled-error.ts";

describe("TripRequestAlreadyCanceledError", () => {
    it("should expose the correct domain code and message", () => {
        const error = new TripRequestAlreadyCanceledError();

        expect(error.getCode())
            .toBe("TRIP_REQUEST_ALREADY_CANCELED");

        expect(error.getMessage())
            .toBe("the trip is already canceled");

        expect(error)
            .toBeInstanceOf(Error);
    });
});
