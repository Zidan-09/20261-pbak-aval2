import { ValidationError } from "../../../../shared/domain/error/validation-error";

export class GetHolidaysValidator {
  static validateYear(year: string): number {
    const parsed = Number(year);

    if (!Number.isInteger(parsed)) {
      throw new ValidationError("Year must be an integer.");
    }

    if (parsed < 1900 || parsed > 3000) {
      throw new ValidationError("Year is out of the allowed range.");
    }

    return parsed;
  }
}
