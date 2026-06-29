import { UseCase } from "#/shared/application/use-case/usecase";
import { TripRequestNotFoundError } from "../../domain/error/trip-not-found-error";
import { TripRepository } from "../../domain/repository/trip-repository";
import { Trip } from "../../domain/trip";
import { CancelTripRequestByIdInput } from "../input/cancel-by-id";
import { CancelTripRequestByIdOutput } from "../output/cancel-by-id";

export class CancelTripRequestByIdUseCase implements UseCase<CancelTripRequestByIdInput, Promise<CancelTripRequestByIdOutput>> {
    constructor(
        private readonly tripRepository: TripRepository
    ) {}

    async execute(input: CancelTripRequestByIdInput): Promise<CancelTripRequestByIdOutput> {
        const trip = await this.tripRepository.findById(input.tripRequestId);

        this.validateTrip(trip);

        trip.cancel();

        await this.tripRepository.save(trip);

        return { trip }
    }

    private validateTrip(trip: Trip | null): asserts trip is Trip {
        if (trip === null) throw new TripRequestNotFoundError();
    }
}