import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";

import { GetHolidaysUseCase } from "#/features/holidays/application/use-cases/get-holidays.ts";
import { HolidayRepository } from "#/features/holidays/domain/repository/holiday-repository.ts";
import { HolidaySyncService } from "#/features/holidays/application/service/holiday-sync-service.ts";
import { Holiday } from "#/features/holidays/domain/holiday.ts";
import { HolidaysApiUnavailableError } from "#/features/holidays/domain/error/holidays-api-unavailable-error.ts";

describe("GetHolidaysUseCase", () => {
    let repository: Mocked<HolidayRepository>;
    let syncService: Mocked<HolidaySyncService>;
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
            saveAll: vi.fn(),
            existsByDate: vi.fn()
        } as unknown as Mocked<HolidayRepository>;

        syncService = {
            ensureSync: vi.fn().mockResolvedValue(undefined)
        } as unknown as Mocked<HolidaySyncService>;

        useCase = new GetHolidaysUseCase(
            repository,
            syncService
        );
    });

    it("should return holidays", async () => {
        repository.get.mockResolvedValue(holidays);

        const output = await useCase.execute({
            year: 2026
        });

        expect(syncService.ensureSync)
            .toHaveBeenCalledWith(2026);

        expect(repository.get)
            .toHaveBeenCalledWith(2026);

        expect(output).toEqual({
            holidays
        });
    });

    it("should propagate HolidaysApiUnavailableError from sync service", async () => {
        syncService.ensureSync.mockRejectedValue(
            new HolidaysApiUnavailableError()
        );

        await expect(
            useCase.execute({
                year: 2026
            })
        ).rejects.toBeInstanceOf(HolidaysApiUnavailableError);

        expect(repository.get)
            .not.toHaveBeenCalled();
    });

    it("should propagate repository errors", async () => {
        repository.get.mockRejectedValue(
            new Error("Database error")
        );

        await expect(
            useCase.execute({
                year: 2026
            })
        ).rejects.toThrow("Database error");

        expect(syncService.ensureSync)
            .toHaveBeenCalledWith(2026);
    });
});