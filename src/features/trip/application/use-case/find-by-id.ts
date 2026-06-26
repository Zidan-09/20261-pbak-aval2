import { UseCase } from "../../../../shared/application/use-case/usecase";
import { TripRequestNotFoundError } from "../../domain/error/trip-request-not-found-error";
import { TripRepository } from "../../domain/repository/trip-repository";
import { Trip } from "../../domain/trip";
import { FindTripRequestByIdInput as FindTripByIdInput } from "../input/find-by-id";
import { FindTripRequestByIdOutput as FindTripByIdOutput } from "../output/find-by-id";

export class FindTripByIdUseCase implements UseCase<FindTripByIdInput, FindTripByIdOutput> {
    constructor(
        private readonly tripRepository: TripRepository 
    ) {

    }

    execute(input: FindTripByIdInput): FindTripByIdOutput {
        const trip = this.tripRepository.findById(input.tripRequestId);
        
        if (trip === null) throw new TripRequestNotFoundError("trip not found on data");

        return this.buildOutput(trip);
    }

    private buildOutput(trip: Trip): FindTripByIdOutput {
        return {
            trip: trip
        }
    }
}