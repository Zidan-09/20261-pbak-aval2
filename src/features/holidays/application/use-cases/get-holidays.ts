import { UseCase } from "#/shared/application/use-case/usecase";
import { HolidaysApiUnavailableError } from "../../domain/error/holidays-api-unavailable-error";
import { HolidaySync } from "../../domain/holiday-sync";
import { HolidayRepository } from "../../domain/repository/holiday-repository";
import { HolidaySyncRepository } from "../../domain/repository/holiday-sync-repository";
import { HolidayProvider } from "../gateway/holiday-provider";
import { GetHolidaysInput } from "../input/get-holidays";
import { GetHolidaysOutput } from "../output/get-holidays";

export class GetHolidaysUseCase implements UseCase<GetHolidaysInput, Promise<GetHolidaysOutput>> {
    constructor(
        private readonly holidayRepository: HolidayRepository,
        private readonly holidaySyncRepository: HolidaySyncRepository,
        private readonly holidayProvider: HolidayProvider
    ) {}

    async execute(input: GetHolidaysInput): Promise<GetHolidaysOutput> {
        const sync = await this.holidaySyncRepository.get(input.year);

        if (this.shouldSync(input.year, sync)) {
            await this.updateHolidays(input.year);
            await this.updateSyncDate(input.year);
        }

        const holidays = await this.holidayRepository.get(input.year);

        return { holidays }
    }

    private shouldSync(
        year: number, 
        sync?: HolidaySync
    ): boolean {
        if (!sync) return true;

        const currentYear = new Date().getFullYear();

        return year <= currentYear + 1 &&
            sync.getSyncedAt().getFullYear() !== currentYear;
    }

    private async updateHolidays(year: number) {
        try {
            const holidays = await this.holidayProvider.get(year);

            await this.holidayRepository.saveAll(holidays);

        } catch (err) {
            throw new HolidaysApiUnavailableError();
        }
    }

    private async updateSyncDate(year: number) {
        const synced = new HolidaySync(year, new Date());

        await this.holidaySyncRepository.save(synced);
    }
}