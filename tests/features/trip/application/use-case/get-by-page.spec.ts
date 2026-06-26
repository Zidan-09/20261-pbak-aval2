import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import { GetTripRequestsByPageUseCase } from "#/features/trip/application/use-case/get-by-page.js";
import { TripRepository } from "#/features/trip/domain/repository/trip-repository.js";
import { Trip } from "#/features/trip/domain/trip.js";

describe("GetTripRequestsByPageUseCase Unit Tests", () => {
    let tripRepositoryMock: Mocked<TripRepository>;
    let sut: GetTripRequestsByPageUseCase;

    const createMockTrip = (fields: Record<string, any>): Trip => {
        return {
            id: "any-id",
            destination: "Default Destination",
            requesterName: "Default Name",
            origin: "Default Origin",
            departureAt: new Date(),
            returnAt: new Date(),
            ...fields,
        } as unknown as Trip;
    };

    beforeEach(() => {
        tripRepositoryMock = {
            getTripsByPage: vi.fn(),
        } as unknown as Mocked<TripRepository>;

        sut = new GetTripRequestsByPageUseCase(tripRepositoryMock);
    });

    it("should call repository with provided page and size", () => {
        tripRepositoryMock.getTripsByPage.mockReturnValue([]);

        sut.execute({
            page: 2,
            size: 10,
        });

        expect(tripRepositoryMock.getTripsByPage).toHaveBeenCalledWith(2, 10);
    });

    it("should use default size when only page is provided", () => {
        tripRepositoryMock.getTripsByPage.mockReturnValue([]);

        sut.execute({
            page: 3,
        });

        expect(tripRepositoryMock.getTripsByPage).toHaveBeenCalledWith(3, 20);
    });

    it("should request all trips when neither page nor size is provided", () => {
        tripRepositoryMock.getTripsByPage.mockReturnValue([]);

        sut.execute({});

        expect(tripRepositoryMock.getTripsByPage).toHaveBeenCalledWith(undefined, undefined);
    });

    it("should ignore size when page is not provided", () => {
        tripRepositoryMock.getTripsByPage.mockReturnValue([]);

        sut.execute({
            size: 50,
        });

        expect(tripRepositoryMock.getTripsByPage).toHaveBeenCalledWith(undefined, undefined);
    });

    it("should return an empty list when repository returns no trips", () => {
        tripRepositoryMock.getTripsByPage.mockReturnValue([]);

        const output = sut.execute({
            page: 1,
        });

        expect(output).toEqual({
            trips: [],
        });
    });

    it("should return all trips returned by the repository", () => {
        const trips = [
            createMockTrip({ id: "trip-1" }),
            createMockTrip({ id: "trip-2" }),
        ];

        tripRepositoryMock.getTripsByPage.mockReturnValue(trips);

        const output = sut.execute({
            page: 1,
        });

        expect(output).toEqual({
            trips,
        });
    });
});