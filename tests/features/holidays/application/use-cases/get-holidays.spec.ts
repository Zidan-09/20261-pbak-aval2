import { beforeEach, describe, expect, it, vi } from "vitest";

import { GetHolidaysUseCase } from "#/features/holidays/application/use-cases/get-holidays.ts";
import { HolidayRepository } from "#/features/holidays/domain/repository/holiday-repository.ts";
import { HolidayProvider } from "#/features/holidays/application/gateway/holiday-provider.ts";
import { Holiday } from "#/features/holidays/domain/holiday.ts";
import { HolidaysApiUnavailableError } from "#/features/holidays/domain/error/holidays-api-unavailable-error.ts";

describe("GetHolidaysUseCase", () => {

    let repository: HolidayRepository;
    let provider: HolidayProvider;
    let useCase: GetHolidaysUseCase;

    const holidays = [
        new Holiday(
            "1",
            new Date("2026-01-01"),
            "Confraternização Universal",
            "national"
        )
    ];

    beforeEach(() => {
        repository = {
            get: vi.fn(),
            save: vi.fn(),
            saveAll: vi.fn()
        } as unknown as HolidayRepository;

        provider = {
            get: vi.fn()
        } as HolidayProvider;

        useCase = new GetHolidaysUseCase(repository, provider);
    });

    it("should return holidays from repository when cache exists", async () => {
        vi.mocked(repository.get).mockResolvedValue(holidays);

        const output = await useCase.execute({ year: 2026 });

        expect(repository.get).toHaveBeenCalledWith(2026);
        expect(provider.get).not.toHaveBeenCalled();
        expect(repository.saveAll).not.toHaveBeenCalled();

        expect(output).toEqual({
            holidays
        });
    });

    it("should fetch holidays from provider and save them when cache is empty", async () => {
        vi.mocked(repository.get).mockResolvedValue([]);

        vi.mocked(provider.get).mockResolvedValue(holidays);

        vi.mocked(repository.saveAll).mockResolvedValue();

        const output = await useCase.execute({ year: 2026 });

        expect(repository.get).toHaveBeenCalledWith(2026);

        expect(provider.get).toHaveBeenCalledWith(2026);

        expect(repository.saveAll).toHaveBeenCalledWith(holidays);

        expect(output).toEqual({
            holidays
        });
    });

    it("should throw HolidaysApiUnavailableError when provider fails", async () => {
        vi.mocked(repository.get).mockResolvedValue([]);

        vi.mocked(provider.get).mockRejectedValue(new Error("API down"));

        await expect(
            useCase.execute({ year: 2026 })
        ).rejects.toBeInstanceOf(HolidaysApiUnavailableError);

        expect(repository.saveAll).not.toHaveBeenCalled();
    });

    it("should propagate repository errors", async () => {
        vi.mocked(repository.get).mockRejectedValue(
            new Error("Database error")
        );

        await expect(
            useCase.execute({ year: 2026 })
        ).rejects.toThrow("Database error");

        expect(provider.get).not.toHaveBeenCalled();
    });

});