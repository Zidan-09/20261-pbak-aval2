import { DomainError } from "../../../../shared/domain/error/domainError";

export class InvalidStatusError extends DomainError {
    constructor(message: string) {
        super(
            "INVALID_STATUS",
            message
        )
    }
}