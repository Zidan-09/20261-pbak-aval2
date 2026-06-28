export class GetHolidaysValidator {
    static validateYear(year: string): number {
        const parsed = Number(year);

        if (!Number.isInteger(parsed)) {
            throw new Error("Year must be an integer.");
        }

        if (parsed < 1900 || parsed > 3000) {
            throw new Error("Year is out of the allowed range.");
        }

        return parsed;
    }
}