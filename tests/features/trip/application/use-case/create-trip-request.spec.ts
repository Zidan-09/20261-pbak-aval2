import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import { CreateTripRequestUseCase } from "#/features/trip/application/use-case/create-trip-request.ts";
import { TripRepository } from "#/features/trip/domain/repository/trip-repository.js";
import { CreateTripRequestInput } from "#/features/trip/application/input/create-trip-request.js";
import { TripStatus } from "#/features/trip/domain/tripStatus.js";
import { Trip } from "#/features/trip/domain/trip.js";

describe("CreateTripRequestUseCase Unit Tests", () => {
    let tripRepositoryMock: Mocked<TripRepository>;
    let sut: CreateTripRequestUseCase;

    beforeEach(() => {
        tripRepositoryMock = {
            save: vi.fn(),
        } as unknown as Mocked<TripRepository>;

        sut = new CreateTripRequestUseCase(tripRepositoryMock);
    });

    it("should create a Trip correctly", () => {
        const departureAt = new Date("2026-07-01T10:00:00.000Z");
        const returnAt = new Date("2026-07-05T10:00:00.000Z");

        const input: CreateTripRequestInput = {
            requesterName: "Samuel Nascimento",
            origin: "Teresina",
            destination: "Fortaleza",
            departureAt,
            returnAt,
            purpose: "Academic event",
            passengerCount: 10,
        };

        const output = sut.execute(input);

        expect(output.trip).toBeInstanceOf(Trip);

        expect(output.trip).toMatchObject({
            requesterName: "Samuel Nascimento",
            origin: "Teresina",
            destination: "Fortaleza",
            departureAt,
            returnAt,
            purpose: "Academic event",
            passengerCount: 10,
            status: TripStatus.PENDING,
        });

        expect(output.trip.getId()).toBeDefined();

        expect(tripRepositoryMock.save)
            .toHaveBeenCalledWith(output.trip);
    });

    it("should throw an error when return date is before departure date", () => {
        const input: CreateTripRequestInput = {
            requesterName: "Samuel Nascimento",
            origin: "Teresina",
            destination: "Fortaleza",
            departureAt: new Date("2026-07-05T10:00:00.000Z"),
            returnAt: new Date("2026-07-01T10:00:00.000Z"),
            purpose: "Academic event",
            passengerCount: 10,
        };

        expect(() => sut.execute(input))
            .toThrow("A data de retorno não pode ser antes da data de saída");

        expect(tripRepositoryMock.save)
            .not.toHaveBeenCalled();
    });


    it("should throw an error when passenger count is zero", () => {
        const input: CreateTripRequestInput = {
            requesterName: "Samuel Nascimento",
            origin: "Teresina",
            destination: "Fortaleza",
            departureAt: new Date("2026-07-01T10:00:00.000Z"),
            returnAt: new Date("2026-07-05T10:00:00.000Z"),
            purpose: "Academic event",
            passengerCount: 0,
        };

        expect(() => sut.execute(input))
            .toThrow("O número de passageiros não pode ser menor que 0");

        expect(tripRepositoryMock.save)
            .not.toHaveBeenCalled();
    });


    it("should throw an error when origin and destination are the same", () => {
        const input: CreateTripRequestInput = {
            requesterName: "Samuel Nascimento",
            origin: "Teresina",
            destination: "teresina",
            departureAt: new Date("2026-07-01T10:00:00.000Z"),
            returnAt: new Date("2026-07-05T10:00:00.000Z"),
            purpose: "Academic event",
            passengerCount: 10,
        };

        expect(() => sut.execute(input))
            .toThrow("O destino não pode ser o mesmo do local de partida");

        expect(tripRepositoryMock.save)
            .not.toHaveBeenCalled();
    });
});