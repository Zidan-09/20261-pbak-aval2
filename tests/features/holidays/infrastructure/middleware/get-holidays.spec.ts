import { describe, expect, it } from "vitest";

import { GetHolidaysValidator } from "#/features/holidays/infrastructure/middleware/get-holidays.ts";

describe("GetHolidaysValidator", () => {

    describe("validateYear", () => {

        it("should return the parsed year when it is valid", () => {
            const result = GetHolidaysValidator.validateYear("2026");

            expect(result).toBe(2026);
        });

        it("should accept the minimum allowed year", () => {
            const result = GetHolidaysValidator.validateYear("1900");

            expect(result).toBe(1900);
        });

        it("should accept the maximum allowed year", () => {
            const result = GetHolidaysValidator.validateYear("3000");

            expect(result).toBe(3000);
        });

        it("should throw when year is not an integer", () => {
            expect(() =>
                GetHolidaysValidator.validateYear("abcd")
            ).toThrow("Year must be an integer.");
        });

        it("should throw when year is a decimal number", () => {
            expect(() =>
                GetHolidaysValidator.validateYear("2026.5")
            ).toThrow("Year must be an integer.");
        });

        it("should throw when year is less than 1900", () => {
            expect(() =>
                GetHolidaysValidator.validateYear("1899")
            ).toThrow("Year is out of the allowed range.");
        });

        it("should throw when year is greater than 3000", () => {
            expect(() =>
                GetHolidaysValidator.validateYear("3001")
            ).toThrow("Year is out of the allowed range.");
        });

    });

});