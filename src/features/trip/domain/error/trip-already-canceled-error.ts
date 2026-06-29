import { DomainError } from "#/shared/domain/error/domain-error";

export class TripRequestAlreadyCanceledError extends DomainError {
    constructor() {
        super(
            "TRIP_REQUEST_ALREADY_CANCELED",
            "the trip is already canceled"
        );
    }
}