import { UseCase } from "#/shared/application/use-case/usecase";
import { TripRequestNotFoundError } from "../../domain/error/trip-request-not-found-error";
import { TripRepository } from "../../domain/repository/trip-repository";
import { Trip } from "../../domain/trip";
import { TripStatus } from "../../domain/tripStatus";
import { CancelTripRequestByIdInput } from "../input/cancel-by-id";
import { CancelTripRequestByIdOutput } from "../output/cancel-by-id";

export class CancelTripRequestByIdUseCase implements UseCase<CancelTripRequestByIdInput, CancelTripRequestByIdOutput> {
    constructor(
        private readonly tripRepository: TripRepository
    ) {}

    execute(input: CancelTripRequestByIdInput): CancelTripRequestByIdOutput {
        const trip = this.tripRepository.findById(input.tripRequestId);
        this.validateTrip(trip);

        // TODO: Trocar o método changeStatus por cancel, melhor forma seguindo o documento (Domínio)
        trip.changeStatus(TripStatus.CANCELED);

        this.tripRepository.save(trip);

        return this.buildOutput(trip);
    }

    private validateTrip(trip: Trip | null): asserts trip is Trip {
        if (trip === null) throw new TripRequestNotFoundError("The Trip was not found");
    }

    private buildOutput(trip: Trip): CancelTripRequestByIdOutput {
        return {
            trip: trip
        }
    }
}