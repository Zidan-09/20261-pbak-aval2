import { UseCase } from "#/shared/application/use-case/usecase";
import { HolidaysApiUnavailableError } from "../../domain/error/holidays-api-unavailable-error";
import { HolidayRepository } from "../../domain/repository/holiday-repository";
import { HolidayProvider } from "../gateway/holiday-provider";
import { GetHolidaysInput } from "../input/get-holidays";
import { GetHolidaysOutput } from "../output/get-holidays";

export class GetHolidaysUseCase implements UseCase<GetHolidaysInput, Promise<GetHolidaysOutput>> {
    constructor(
        private readonly holidayRepository: HolidayRepository,
        private readonly holidayProvider: HolidayProvider
    ) {}

    async execute(input: GetHolidaysInput): Promise<GetHolidaysOutput> {
        let holidays = await this.holidayRepository.get(input.year);

        if (holidays.length === 0) {
            holidays = await this.updateHolidays(input.year);
        }

        return { holidays }
    }

    private async updateHolidays(year: number) {
        try {
            const holidays  = await this.holidayProvider.get(year);

            await this.holidayRepository.saveAll(holidays );

            return holidays;
        } catch (err) {
            throw new HolidaysApiUnavailableError();
        }
    }
}