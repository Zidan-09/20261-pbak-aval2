import { FindTripRequestByIdInput } from "#/features/trip/application/input/find-by-id";
import { FindTripRequestByIdOutput } from "#/features/trip/application/output/find-by-id";
import { Trip } from "#/features/trip/domain/trip";
import { TripStatus } from "#/features/trip/domain/tripStatus";
import { ValidationError } from "#/shared/domain/error/validation-error";
import { FindTripRequestByIdParams } from "../dto/request/find-by-id";
import { FindTripRequestByIdResponse } from "../dto/response/find-by-id";
import { TripDto } from "../dto/response/trip-dto";

export class FindTripRequestByIdMapper {
    static toInput(params: FindTripRequestByIdParams): FindTripRequestByIdInput {
        return {
            tripRequestId: this.validateId(params.tripRequestId)
        }
    }

    static toResponse(output: FindTripRequestByIdOutput): FindTripRequestByIdResponse {
        return {
            trip: this.toDto(output.trip)
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

    private static validateId(value: string): string {
        const normalized = value?.trim();

        if (!normalized) {
            throw new ValidationError("Trip request id is required.");
        }

        return normalized;
    }
}
