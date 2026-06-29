import { UseCase } from "#/shared/application/use-case/usecase";
import { HolidayRepository } from "../../domain/repository/holiday-repository";
import { GetHolidaysInput } from "../input/get-holidays";
import { GetHolidaysOutput } from "../output/get-holidays";
import { HolidaySyncService } from "../service/holiday-sync-service";

export class GetHolidaysUseCase implements UseCase<GetHolidaysInput, Promise<GetHolidaysOutput>> {
    constructor(
        private readonly holidayRepository: HolidayRepository,
        private readonly holidaySyncService: HolidaySyncService
    ) {}

    async execute(input: GetHolidaysInput): Promise<GetHolidaysOutput> {
        await this.holidaySyncService.ensureSync(input.year);

        const holidays = await this.holidayRepository.get(input.year);

        return { holidays };
    }
}