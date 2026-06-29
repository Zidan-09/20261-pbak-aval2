import { DomainError } from "./domain-error";

export class ValidationError extends DomainError {
    constructor() {
        super(
            "VALIDATION_ERROR",
            "" // Inserir um texto em inglês válido
        ); 
    }
}