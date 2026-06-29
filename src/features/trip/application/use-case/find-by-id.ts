import { UseCase } from "../../../../shared/application/use-case/usecase";
import { TripRequestNotFoundError } from "../../domain/error/trip-not-found-error";
import { TripRepository } from "../../domain/repository/trip-repository";
import { FindTripRequestByIdInput as FindTripByIdInput } from "../input/find-by-id";
import { FindTripRequestByIdOutput as FindTripByIdOutput } from "../output/find-by-id";

export class FindTripByIdUseCase implements UseCase<FindTripByIdInput, Promise<FindTripByIdOutput>> {
    constructor(
        private readonly tripRepository: TripRepository 
    ) {}

    async execute(input: FindTripByIdInput): Promise<FindTripByIdOutput> {
        const trip = await this.tripRepository.findById(input.tripRequestId);
        
        if (trip === null) throw new TripRequestNotFoundError();

        return { trip };
    }
}