import { DomainError } from "#/shared/domain/error/domain-error";

export class ReturnDateBeforeDepartureError extends DomainError {
    constructor() {
        super(
            "RETURN_DATE_BEFORE_DEPARTURE",
            "the return date cannot be before the departure date"
        );
    }
}