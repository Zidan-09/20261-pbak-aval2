import { HolidayRepository } from "../../domain/repository/holiday-repository";
import { HolidayProvider } from "../gateway/holiday-provider";
import { HolidaySync } from "../../domain/holiday-sync";
import { HolidaysApiUnavailableError } from "../../domain/error/holidays-api-unavailable-error";
import { HolidaySyncRepository } from "../../domain/repository/holiday-sync-repository";

export class HolidaySyncService {
    constructor(
        private readonly holidayProvider: HolidayProvider,
        private readonly holidayRepository: HolidayRepository,
        private readonly holidaySyncRepository: HolidaySyncRepository
    ) {}

    shouldSync(
        year: number,
        sync: HolidaySync | null,
    ): boolean {
        if (!sync) return true;

        const currentYear = new Date().getFullYear();

        return year <= currentYear + 1 &&
            sync.getSyncedAt().getFullYear() !== currentYear;
    }

    async sync(year: number): Promise<void> {
        try {
            const holidays = await this.holidayProvider.get(year);

            await this.holidayRepository.saveAll(holidays);

            await this.saveSync(year);
            
        } catch {
            throw new HolidaysApiUnavailableError();
        }
    }

    async ensureSync(year: number): Promise<void> {
        const sync = await this.holidaySyncRepository.get(year);

        if (this.shouldSync(year, sync)) {
            await this.sync(year);
        }
    }

    private async saveSync(year: number) {
        const synced = new HolidaySync(year, new Date());

        await this.holidaySyncRepository.save(synced);
    }
}