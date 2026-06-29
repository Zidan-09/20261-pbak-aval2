import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import { CancelTripRequestByIdUseCase } from "#/features/trip/application/use-case/cancel-by-id.ts";
import { TripRepository } from "#/features/trip/domain/repository/trip-repository.js";
import { TripStatus } from "#/features/trip/domain/tripStatus.js";
import { Trip } from "#/features/trip/domain/trip.js";

describe("CancelTripRequestByIdUseCase Unit Tests", () => {
    let tripRepositoryMock: Mocked<TripRepository>;
    let sut: CancelTripRequestByIdUseCase;

    const createMockTrip = (fields?: Partial<Trip>): Trip => {
        return new Trip(
            "any-id",
            "Requester Name",
            "Origin",
            "Destination",
            new Date("2026-07-01T10:00:00.000Z"),
            new Date("2026-07-05T10:00:00.000Z"),
            "Academic event",
            10,
            TripStatus.PENDING,
            new Date(2026, 5, 28)
        );
    };

    beforeEach(() => {
        tripRepositoryMock = {
            findById: vi.fn(),
            save: vi.fn(),
        } as unknown as Mocked<TripRepository>;

        sut = new CancelTripRequestByIdUseCase(tripRepositoryMock);
    });

    it("should cancel a trip correctly", () => {
        const mockTripId = "any-valid-uuid";
        
        const mockTrip = createMockTrip();

        tripRepositoryMock.findById.mockReturnValue(mockTrip);

        const input = { tripRequestId: mockTripId };

        const expected = createMockTrip();
        expected.changeStatus(TripStatus.CANCELED);

        const output = sut.execute(input);

        expect(tripRepositoryMock.findById).toHaveBeenCalledTimes(1);
        expect(tripRepositoryMock.findById).toHaveBeenCalledWith(mockTripId);
        expect(output).toEqual({ trip: expected });
    });

    it("should throw an error when trip was not founded", () => {
        const mockTripId = "any-invalid-uuid";

        tripRepositoryMock.findById.mockReturnValue(null);

        const input = { tripRequestId: mockTripId };

        expect(() => sut.execute(input))
            .toThrow("The Trip was not found");

        expect(tripRepositoryMock.save).not.toHaveBeenCalled();
    });

    it("should throw an error when trip already been canceled", () => {
        const mockTripId = "any-valid-uuid";
        
        const mockTrip = createMockTrip();

        tripRepositoryMock.findById.mockReturnValue(mockTrip);
        mockTrip.changeStatus(TripStatus.CANCELED);

        const input = { tripRequestId: mockTripId };

        expect(() => sut.execute(input))
            .toThrow("can not change status to be the same");

        expect(tripRepositoryMock.save).not.toHaveBeenCalled();
    });
});