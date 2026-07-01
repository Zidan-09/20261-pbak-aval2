import { CreateTripRequestInput } from "#/features/trip/application/input/create-trip-request";
import { CreateTripRequestOutput } from "#/features/trip/application/output/create-trip-request";
import { Trip } from "#/features/trip/domain/trip";
import { TripStatus } from "#/features/trip/domain/tripStatus";
import { ValidationError } from "#/shared/domain/error/validation-error";
import { CreateTripRequestBody } from "../dto/request/create-trip-request";
import { CreateTripRequestResponse } from "../dto/response/create-trip-request";
import { TripDto } from "../dto/response/trip-dto";

export class CreateTripRequestMapper {
    static toInput(body: CreateTripRequestBody): CreateTripRequestInput {
        return {
            requesterName: this.validateText(body.requesterName, "Requester name"),
            origin: this.validateText(body.origin, "Origin"),
            destination: this.validateText(body.destination, "Destination"),
            departureAt: this.validateDate(body.departureAt, "Departure date"),
            returnAt: this.validateDate(body.returnAt, "Return date"),
            purpose: this.validateText(body.purpose, "Purpose"),
            passengerCount: this.validatePassengerCount(body.passengerCount),
        }
    }

    static toResponse(output: CreateTripRequestOutput): CreateTripRequestResponse {
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

    private static validateText(value: string, field: string): string {
        const normalized = value?.trim();

        if (!normalized) {
            throw new ValidationError(`${field} is required.`);
        }

        return normalized;
    }

    private static validateDate(value: string, field: string): Date {
        const parsed = new Date(value);

        if (Number.isNaN(parsed.getTime())) {
            throw new ValidationError(`${field} must be a valid date.`);
        }

        return parsed;
    }

    private static validatePassengerCount(value: number): number {
        if (!Number.isInteger(value)) {
            throw new ValidationError("Passenger count must be an integer.");
        }

        return value;
    }
}
