import { DomainError } from "#/shared/domain/error/domain-error";

export class InvalidPassengerCountError extends DomainError {
    constructor() {
        super(
            "INVALID_PASSENGER_COUNT",
            "the number of passengers cannot be less than zero"
        );
    }
}