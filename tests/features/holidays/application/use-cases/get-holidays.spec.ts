import { beforeEach, describe, expect, it, vi } from "vitest";

import { GetHolidaysUseCase } from "#/features/holidays/application/use-cases/get-holidays.ts";
import { HolidayRepository } from "#/features/holidays/domain/repository/holiday-repository.ts";
import { HolidaySyncRepository } from "#/features/holidays/domain/repository/holiday-sync-repository.ts";
import { HolidayProvider } from "#/features/holidays/application/gateway/holiday-provider.ts";
import { Holiday } from "#/features/holidays/domain/holiday.ts";
import { HolidaySync } from "#/features/holidays/domain/holiday-sync.ts";
import { HolidaysApiUnavailableError } from "#/features/holidays/domain/error/holidays-api-unavailable-error.ts";

describe("GetHolidaysUseCase", () => {

    let repository: HolidayRepository;
    let syncRepository: HolidaySyncRepository;
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

        syncRepository = {
            get: vi.fn(),
            save: vi.fn()
        };

        provider = {
            get: vi.fn()
        };

        useCase = new GetHolidaysUseCase(
            repository,
            syncRepository,
            provider
        );
    });


    it("should return holidays without updating when sync is from current year", async () => {
        const sync = new HolidaySync(
            2026,
            new Date()
        );

        vi.mocked(syncRepository.get)
            .mockResolvedValue(sync);

        vi.mocked(repository.get)
            .mockResolvedValue(holidays);


        const output = await useCase.execute({
            year: 2026
        });


        expect(syncRepository.get)
            .toHaveBeenCalledWith(2026);

        expect(provider.get)
            .not.toHaveBeenCalled();

        expect(repository.saveAll)
            .not.toHaveBeenCalled();

        expect(syncRepository.save)
            .not.toHaveBeenCalled();

        expect(output)
            .toEqual({
                holidays
            });
    });


    it("should update holidays when sync does not exist", async () => {
        vi.mocked(syncRepository.get)
            .mockResolvedValue(null);

        vi.mocked(provider.get)
            .mockResolvedValue(holidays);

        vi.mocked(repository.saveAll)
            .mockResolvedValue();

        vi.mocked(syncRepository.save)
            .mockResolvedValue();

        vi.mocked(repository.get)
            .mockResolvedValue(holidays);


        const output = await useCase.execute({
            year: 2026
        });


        expect(provider.get)
            .toHaveBeenCalledWith(2026);

        expect(repository.saveAll)
            .toHaveBeenCalledWith(holidays);

        expect(syncRepository.save)
            .toHaveBeenCalled();

        expect(output)
            .toEqual({
                holidays
            });
    });


    it("should update holidays when sync is from an old year", async () => {
        const oldSync = new HolidaySync(
            2026,
            new Date("2025-01-01")
        );

        vi.mocked(syncRepository.get)
            .mockResolvedValue(oldSync);

        vi.mocked(provider.get)
            .mockResolvedValue(holidays);

        vi.mocked(repository.get)
            .mockResolvedValue(holidays);


        await useCase.execute({
            year: 2026
        });


        expect(provider.get)
            .toHaveBeenCalledWith(2026);

        expect(repository.saveAll)
            .toHaveBeenCalledWith(holidays);

        expect(syncRepository.save)
            .toHaveBeenCalled();
    });


    it("should throw HolidaysApiUnavailableError when provider fails", async () => {
        vi.mocked(syncRepository.get)
            .mockResolvedValue(null);

        vi.mocked(provider.get)
            .mockRejectedValue(
                new Error("API down")
            );


        await expect(
            useCase.execute({
                year: 2026
            })
        )
        .rejects
        .toBeInstanceOf(HolidaysApiUnavailableError);


        expect(repository.saveAll)
            .not.toHaveBeenCalled();

        expect(syncRepository.save)
            .not.toHaveBeenCalled();
    });


    it("should propagate repository errors", async () => {
        vi.mocked(syncRepository.get)
            .mockRejectedValue(
                new Error("Database error")
            );


        await expect(
            useCase.execute({
                year: 2026
            })
        )
        .rejects
        .toThrow("Database error");


        expect(provider.get)
            .not.toHaveBeenCalled();
    });

});