import { DomainError } from "#/shared/domain/error/domain-error";

export class SameOriginDestinationError extends DomainError {
    constructor() {
        super(
            "SAME_ORIGIN_DESTINATION",
            "the destination cannot be the same as the departure location"
        );
    }
}