import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";

import { GetTripRequestsByPageUseCase } from "#/features/trip/application/use-case/get-by-page.ts";
import { TripRepository } from "#/features/trip/domain/repository/trip-repository.ts";
import { Trip } from "#/features/trip/domain/trip.ts";


describe("GetTripRequestsByPageUseCase Unit Tests", () => {

    let tripRepositoryMock: Mocked<TripRepository>;
    let sut: GetTripRequestsByPageUseCase;


    const createMockTrip = (id: string): Trip => {
        return {
            id,
            destination: "Fortaleza",
            requesterName: "Samuel",
            origin: "Teresina",
            departureAt: new Date(),
            returnAt: new Date(),
        } as unknown as Trip;
    };


    beforeEach(() => {
        tripRepositoryMock = {
            getTripsByPage: vi.fn(),
        } as unknown as Mocked<TripRepository>;


        sut = new GetTripRequestsByPageUseCase(
            tripRepositoryMock
        );
    });


    it("should call repository with provided page and size", async () => {

        tripRepositoryMock.getTripsByPage
            .mockResolvedValue([]);


        await sut.execute({
            page: 2,
            size: 10,
        });


        expect(tripRepositoryMock.getTripsByPage)
            .toHaveBeenCalledWith(2, 10);
    });


    it("should use default size when only page is provided", async () => {

        tripRepositoryMock.getTripsByPage
            .mockResolvedValue([]);


        await sut.execute({
            page: 3,
        });


        expect(tripRepositoryMock.getTripsByPage)
            .toHaveBeenCalledWith(3, 20);
    });


    it("should request all trips when neither page nor size is provided", async () => {

        tripRepositoryMock.getTripsByPage
            .mockResolvedValue([]);


        await sut.execute({});


        expect(tripRepositoryMock.getTripsByPage)
            .toHaveBeenCalledWith(undefined, undefined);
    });


    it("should ignore size when page is not provided", async () => {

        tripRepositoryMock.getTripsByPage
            .mockResolvedValue([]);


        await sut.execute({
            size: 50,
        });


        expect(tripRepositoryMock.getTripsByPage)
            .toHaveBeenCalledWith(undefined, undefined);
    });


    it("should return an empty list when repository returns no trips", async () => {

        tripRepositoryMock.getTripsByPage
            .mockResolvedValue([]);


        const output = await sut.execute({
            page: 1,
        });


        expect(output)
            .toEqual({
                trips: [],
            });
    });


    it("should return all trips returned by repository", async () => {

        const trips = [
            createMockTrip("trip-1"),
            createMockTrip("trip-2"),
        ];


        tripRepositoryMock.getTripsByPage
            .mockResolvedValue(trips);


        const output = await sut.execute({
            page: 1,
        });


        expect(output)
            .toEqual({
                trips,
            });
    });


    it("should propagate repository errors", async () => {

        tripRepositoryMock.getTripsByPage
            .mockRejectedValue(
                new Error("Database error")
            );


        await expect(
            sut.execute({
                page: 1,
            })
        )
        .rejects
        .toThrow("Database error");
    });

});