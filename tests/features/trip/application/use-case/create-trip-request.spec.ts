import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";

import { CreateTripRequestUseCase } from "#/features/trip/application/use-case/create-trip-request.ts";
import { TripRepository } from "#/features/trip/domain/repository/trip-repository.ts";
import { HolidayRepository } from "#/features/holidays/domain/repository/holiday-repository.ts";
import { CreateTripRequestInput } from "#/features/trip/application/input/create-trip-request.ts";
import { TripStatus } from "#/features/trip/domain/tripStatus.ts";
import { Trip } from "#/features/trip/domain/trip.ts";

import { HolidayTripNotAllowedError } from "#/features/trip/domain/error/holiday-trip-not-allowed-error.ts";
import { InvalidPassengerCountError } from "#/features/trip/domain/error/invalid-passenger-count-error.ts";
import { ReturnDateBeforeDepartureError } from "#/features/trip/domain/error/return-date-before-departure-error.ts";
import { SameOriginDestinationError } from "#/features/trip/domain/error/same-origin-destination-error.ts";
import { TripAlreadyExistsError } from "#/features/trip/domain/error/trip-already-exists-error.ts";


describe("CreateTripRequestUseCase Unit Tests", () => {

    let tripRepositoryMock: Mocked<TripRepository>;
    let holidayRepositoryMock: Mocked<HolidayRepository>;

    let sut: CreateTripRequestUseCase;


    beforeEach(() => {
        tripRepositoryMock = {
            save: vi.fn(),
            checkIfExists: vi.fn()
        } as unknown as Mocked<TripRepository>;


        holidayRepositoryMock = {
            existsByDate: vi.fn()
        } as unknown as Mocked<HolidayRepository>;


        sut = new CreateTripRequestUseCase(
            tripRepositoryMock,
            holidayRepositoryMock
        );
    });


    const createInput = (
        overrides?: Partial<CreateTripRequestInput>
    ): CreateTripRequestInput => ({
        requesterName: "Samuel Nascimento",
        origin: "Teresina",
        destination: "Fortaleza",
        departureAt: new Date("2026-07-01T10:00:00.000Z"),
        returnAt: new Date("2026-07-05T10:00:00.000Z"),
        purpose: "Academic event",
        passengerCount: 10,
        ...overrides
    });


    it("should create a trip correctly", async () => {

        tripRepositoryMock.checkIfExists
            .mockResolvedValue(false);

        holidayRepositoryMock.existsByDate
            .mockResolvedValue(false);


        const output = await sut.execute(
            createInput()
        );


        expect(output.trip)
            .toBeInstanceOf(Trip);


        expect(output.trip.getStatus())
            .toBe(TripStatus.PENDING);


        expect(tripRepositoryMock.save)
            .toHaveBeenCalledWith(output.trip);
    });


    it("should throw TripAlreadyExistsError when trip already exists", async () => {

        tripRepositoryMock.checkIfExists
            .mockResolvedValue(true);


        await expect(
            sut.execute(createInput())
        )
        .rejects
        .toBeInstanceOf(TripAlreadyExistsError);


        expect(tripRepositoryMock.save)
            .not
            .toHaveBeenCalled();
    });


    it("should throw HolidayTripNotAllowedError when departure date is holiday", async () => {

        tripRepositoryMock.checkIfExists
            .mockResolvedValue(false);

        holidayRepositoryMock.existsByDate
            .mockResolvedValue(true);


        await expect(
            sut.execute(createInput())
        )
        .rejects
        .toBeInstanceOf(HolidayTripNotAllowedError);


        expect(tripRepositoryMock.save)
            .not
            .toHaveBeenCalled();
    });


    it("should throw ReturnDateBeforeDepartureError when return date is before departure", async () => {

        await expect(
            sut.execute(
                createInput({
                    departureAt: new Date("2026-07-05"),
                    returnAt: new Date("2026-07-01")
                })
            )
        )
        .rejects
        .toBeInstanceOf(ReturnDateBeforeDepartureError);


        expect(tripRepositoryMock.save)
            .not
            .toHaveBeenCalled();
    });


    it("should throw InvalidPassengerCountError when passenger count is invalid", async () => {

        await expect(
            sut.execute(
                createInput({
                    passengerCount: 0
                })
            )
        )
        .rejects
        .toBeInstanceOf(InvalidPassengerCountError);


        expect(tripRepositoryMock.save)
            .not
            .toHaveBeenCalled();
    });


    it("should throw SameOriginDestinationError when origin equals destination", async () => {

        await expect(
            sut.execute(
                createInput({
                    origin: "Teresina",
                    destination: "teresina"
                })
            )
        )
        .rejects
        .toBeInstanceOf(SameOriginDestinationError);


        expect(tripRepositoryMock.save)
            .not
            .toHaveBeenCalled();
    });

});