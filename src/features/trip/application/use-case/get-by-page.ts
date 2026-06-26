import { UseCase } from "#/shared/application/use-case/usecase";
import { TripRepository } from "../../domain/repository/trip-repository";
import { Trip } from "../../domain/trip";
import { GetTripRequestsByPageInput } from "../input/get-by-page";
import { GetTripRequestsByPageOutput } from "../output/get-by-page";

export class GetTripRequestsByPageUseCase implements UseCase<GetTripRequestsByPageInput, GetTripRequestsByPageOutput> {
    constructor(
        private readonly tripRepository: TripRepository
    ) {}

    execute(input: GetTripRequestsByPageInput): GetTripRequestsByPageOutput {
        const { page, size } = this.normalizeInput(input);

        const tripRequests = this.tripRepository.getTripsByPage(page, size);

        return this.buildOutput(tripRequests);
    }

    private normalizeInput(input: GetTripRequestsByPageInput): { page?: number, size?: number } {
        if (input.page === undefined) return {};

        if (input.size === undefined) return { page: input.page, size: 20 };

        return { page: input.page, size: input.size };
    }

    private buildOutput(trips: Trip[]): GetTripRequestsByPageOutput {
        return {
            trips: trips
        }
    }
}