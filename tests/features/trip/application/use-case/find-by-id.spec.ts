import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import { FindTripByIdUseCase } from "#/features/trip/application/use-case/find-by-id.ts";
import { TripRepository } from "#/features/trip/domain/repository/trip-repository.js";
import { TripRequestNotFoundError } from "#/features/trip/domain/error/trip-request-not-found-error.js";
import { Trip } from "#/features/trip/domain/trip.js";

describe("FindTripByIdUseCase Unit Tests", () => {
    let tripRepositoryMock: Mocked<TripRepository>;
    let sut: FindTripByIdUseCase;

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
            findById: vi.fn(),
        } as unknown as Mocked<TripRepository>;

        sut = new FindTripByIdUseCase(tripRepositoryMock);
    });

    it("deve retornar uma viagem com sucesso quando o id existente for fornecido", () => {
        const mockTripId = "any-valid-uuid";
        
        const mockTrip = createMockTrip({ 
            id: mockTripId, 
            destination: "Paris" 
        });

        tripRepositoryMock.findById.mockReturnValue(mockTrip);

        const input = { tripRequestId: mockTripId };

        const output = sut.execute(input);

        expect(tripRepositoryMock.findById).toHaveBeenCalledTimes(1);
        expect(tripRepositoryMock.findById).toHaveBeenCalledWith(mockTripId);
        expect(output).toEqual({ trip: mockTrip });
    });

    it("deve lançar um TripRequestNotFoundError quando a viagem não for encontrada", () => {
        const mockTripId = "non-existent-id";
        
        tripRepositoryMock.findById.mockReturnValue(null);

        const input = { tripRequestId: mockTripId };

        expect(() => sut.execute(input)).throw(TripRequestNotFoundError);
        
        expect(tripRepositoryMock.findById).toHaveBeenCalledTimes(1);
        expect(tripRepositoryMock.findById).toHaveBeenCalledWith(mockTripId);
    });

    it("deve repassar qualquer erro inesperado lançado pelo TripRepository", () => {
        const mockTripId = "any-id";
        const dbError = new Error("Database connection timeout");
        
        tripRepositoryMock.findById.mockImplementation(() => {
            throw dbError;
        });

        const input = { tripRequestId: mockTripId };

        expect(() => sut.execute(input)).throw("Database connection timeout");
        expect(tripRepositoryMock.findById).toHaveBeenCalledTimes(1);
    });
});