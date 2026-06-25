import { DomainError } from "../../../../shared/domain/domainError";

export class InvalidStatusError extends DomainError {
    constructor(message: string) {
        super(
            "INVALID_STATUS",
            message
        )
    }
}