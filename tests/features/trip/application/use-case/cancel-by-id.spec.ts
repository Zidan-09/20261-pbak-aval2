import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import { CancelTripRequestByIdUseCase } from "#/features/trip/application/use-case/cancel-by-id.ts";
import { TripRepository } from "#/features/trip/domain/repository/trip-repository.js";
import { TripStatus } from "#/features/trip/domain/tripStatus.js";
import { Trip } from "#/features/trip/domain/trip.js";
import { TripRequestNotFoundError } from "#/features/trip/domain/error/trip-not-found-error.js";
import { TripRequestAlreadyCanceledError } from "../../../../../src/features/trip/domain/error/trip-already-canceled-error";

describe("CancelTripRequestByIdUseCase Unit Tests", () => {
    let tripRepositoryMock: Mocked<TripRepository>;
    let sut: CancelTripRequestByIdUseCase;

    const createMockTrip = (): Trip => {
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

        sut = new CancelTripRequestByIdUseCase(
            tripRepositoryMock
        );
    });


    it("should cancel a trip correctly", async () => {
        const mockTripId = "any-valid-uuid";

        const mockTrip = createMockTrip();

        tripRepositoryMock.findById
            .mockResolvedValue(mockTrip);

        tripRepositoryMock.save
            .mockResolvedValue();


        const output = await sut.execute({
            tripRequestId: mockTripId
        });


        expect(tripRepositoryMock.findById)
            .toHaveBeenCalledWith(mockTripId);

        expect(tripRepositoryMock.save)
            .toHaveBeenCalledWith(mockTrip);

        expect(output.trip.getStatus())
            .toBe(TripStatus.CANCELED);
    });


    it("should throw TripRequestNotFoundError when trip was not found", async () => {
        tripRepositoryMock.findById
            .mockResolvedValue(null);


        await expect(
            sut.execute({
                tripRequestId: "any-invalid-uuid"
            })
        )
        .rejects
        .toBeInstanceOf(TripRequestNotFoundError);


        expect(tripRepositoryMock.save)
            .not
            .toHaveBeenCalled();
    });


    it("should throw error when trip is already canceled", async () => {
        const mockTrip = createMockTrip();

        mockTrip.cancel();

        tripRepositoryMock.findById
            .mockResolvedValue(mockTrip);


        await expect(
            sut.execute({
                tripRequestId: "any-valid-uuid"
            })
        )
        .rejects
        .toBeInstanceOf(TripRequestAlreadyCanceledError);


        expect(tripRepositoryMock.save)
            .not
            .toHaveBeenCalled();
    });
});