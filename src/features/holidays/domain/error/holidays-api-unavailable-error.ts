import { DomainError } from "#/shared/domain/error/domainError";

export class HolidaysApiUnavailableError extends DomainError {
    constructor() {
        super(
            "HOLIDAYS_API_UNAVAILABLE", 
            "the holidays api is temporarily unavailable"
        );
    }
}