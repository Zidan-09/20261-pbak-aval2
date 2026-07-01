import { GetTripRequestsByPageInput } from "#/features/trip/application/input/get-by-page";
import { GetTripRequestsByPageOutput } from "#/features/trip/application/output/get-by-page";
import { Trip } from "#/features/trip/domain/trip";
import { TripStatus } from "#/features/trip/domain/tripStatus";
import { ValidationError } from "#/shared/domain/error/validation-error";
import { GetTripRequestsByPageQuery } from "../dto/request/get-by-page";
import { GetTripRequestsByPageResponse } from "../dto/response/get-by-page";
import { TripDto } from "../dto/response/trip-dto";

export class GetTripRequestsByPageMapper {
    static toInput(query: GetTripRequestsByPageQuery): GetTripRequestsByPageInput {
        if (query.page === undefined) {
            return {};
        }

        const input: GetTripRequestsByPageInput = {
            page: this.parseInteger(query.page, "Page")
        };

        if (query.size !== undefined) {
            input.size = this.parseInteger(query.size, "Size");
        }

        return input;
    }

    static toResponse(output: GetTripRequestsByPageOutput): GetTripRequestsByPageResponse {
        return {
            trips: output.trips.map(this.toDto)
        }
    }

    private static toDto(trip: Trip): TripDto {
        return {
            id: trip.getId(),
            requesterName: trip.getRequesterName(),
            origin: trip.getOrigin(),
            destination: trip.getDestionation(),
            departureAt: trip.getDepartureDate().toISOString(),
            returnAt: trip.getReturnDate().toISOString(),
            purpose: trip.getPurpose(),
            passengerCount: trip.getPassengerCount(),
            status: this.toStatusDto(trip.getStatus()),
            createdAt: trip.getCreatedDate().toISOString()
        }
    }

    private static toStatusDto(status: TripStatus): TripDto["status"] {
        switch (status) {
            case TripStatus.PENDING:
                return "PENDING";

            case TripStatus.CANCELED:
                return "CANCELED";
        }

        throw new Error("Unsupported trip status.");
    }

    private static parseInteger(value: string, field: string): number {
        const parsed = Number(value);

        if (!Number.isInteger(parsed)) {
            throw new ValidationError(`${field} must be an integer.`);
        }

        return parsed;
    }
}
