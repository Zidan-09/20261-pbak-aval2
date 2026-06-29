import { ErrorCode } from "../../infrastructure/presentation/error-codes";

export class DomainError extends Error {
  constructor(
    private readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
  }

  public getCode() {
    return this.code;
  }

  public getMessage() {
    return this.message;
  }
}
