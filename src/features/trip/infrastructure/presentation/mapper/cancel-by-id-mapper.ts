import { CancelTripRequestByIdInput } from "#/features/trip/application/input/cancel-by-id";
import { CancelTripRequestByIdOutput } from "#/features/trip/application/output/cancel-by-id";
import { Trip } from "#/features/trip/domain/trip";
import { TripStatus } from "#/features/trip/domain/tripStatus";
import { ValidationError } from "#/shared/domain/error/validation-error";
import { CancelTripRequestByIdParams } from "../dto/request/cancel-by-id";
import { CancelTripRequestByIdResponse } from "../dto/response/cancel-by-id";
import { TripDto } from "../dto/response/trip-dto";

export class CancelTripRequestByIdMapper {
    static toInput(params: CancelTripRequestByIdParams): CancelTripRequestByIdInput {
        return {
            tripRequestId: this.validateId(params.tripRequestId)
        }
    }

    static toResponse(output: CancelTripRequestByIdOutput): CancelTripRequestByIdResponse {
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
