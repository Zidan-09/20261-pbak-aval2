import { DomainError } from "#/shared/domain/error/domain-error"

export class HolidayTripNotAllowedError extends DomainError {
    constructor() {
        super(
            "HOLIDAY_TRIP_NOT_ALLOWED",
            "the selected departure date is a national holiday"
        );
    }
}