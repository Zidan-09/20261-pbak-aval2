import { DomainError } from "#/shared/domain/error/domain-error";

export class TripAlreadyExistsError extends DomainError {
    constructor() {
        super(
            "TRIP_ALREADY_EXISTS",
            "the trip already exists"
        );
    }
}