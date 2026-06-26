import { DomainError } from "../../../../shared/domain/domainError";

export class TripRequestNotFoundError extends DomainError {
    constructor(message: string) {
        super(
            "TRIP_REQUEST_NOT_FOUND",
            message
        );
    }
}