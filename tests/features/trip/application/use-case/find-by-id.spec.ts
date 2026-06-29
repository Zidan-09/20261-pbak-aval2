import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";

import { FindTripByIdUseCase } from "#/features/trip/application/use-case/find-by-id.ts";
import { TripRepository } from "#/features/trip/domain/repository/trip-repository.ts";
import { TripRequestNotFoundError } from "#/features/trip/domain/error/trip-not-found-error.ts";
import { Trip } from "#/features/trip/domain/trip.ts";
import { TripStatus } from "#/features/trip/domain/tripStatus.ts";


describe("FindTripByIdUseCase Unit Tests", () => {

    let tripRepositoryMock: Mocked<TripRepository>;
    let sut: FindTripByIdUseCase;


    const createMockTrip = (): Trip => {
        return new Trip(
            "any-id",
            "Samuel Nascimento",
            "Teresina",
            "Fortaleza",
            new Date("2026-07-01T10:00:00.000Z"),
            new Date("2026-07-05T10:00:00.000Z"),
            "Academic event",
            10,
            TripStatus.PENDING,
            new Date()
        );
    };


    beforeEach(() => {
        tripRepositoryMock = {
            findById: vi.fn(),
        } as unknown as Mocked<TripRepository>;


        sut = new FindTripByIdUseCase(
            tripRepositoryMock
        );
    });


    it("should return a trip correctly when uuid is valid", async () => {

        const mockTripId = "any-valid-uuid";

        const mockTrip = createMockTrip();


        tripRepositoryMock.findById
            .mockResolvedValue(mockTrip);


        const output = await sut.execute({
            tripRequestId: mockTripId
        });


        expect(tripRepositoryMock.findById)
            .toHaveBeenCalledTimes(1);


        expect(tripRepositoryMock.findById)
            .toHaveBeenCalledWith(mockTripId);


        expect(output)
            .toEqual({
                trip: mockTrip
            });
    });


    it("should throw TripRequestNotFoundError when trip was not found", async () => {

        const mockTripId = "non-existent-id";


        tripRepositoryMock.findById
            .mockResolvedValue(null);


        await expect(
            sut.execute({
                tripRequestId: mockTripId
            })
        )
        .rejects
        .toBeInstanceOf(TripRequestNotFoundError);


        expect(tripRepositoryMock.findById)
            .toHaveBeenCalledWith(mockTripId);
    });


    it("should propagate repository errors", async () => {

        const dbError = new Error(
            "Database connection timeout"
        );


        tripRepositoryMock.findById
            .mockRejectedValue(dbError);


        await expect(
            sut.execute({
                tripRequestId: "any-id"
            })
        )
        .rejects
        .toThrow("Database connection timeout");


        expect(tripRepositoryMock.findById)
            .toHaveBeenCalledTimes(1);
    });

});