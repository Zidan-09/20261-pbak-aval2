import { DomainError } from "../../../../shared/domain/error/domain-error";

export class TripRequestNotFoundError extends DomainError {
    constructor() {
        super(
            "TRIP_REQUEST_NOT_FOUND",
            "the trip was not found"
        );
    }
}