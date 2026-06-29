import { HolidayProvider } from "#/features/holidays/application/gateway/holiday-provider";
import { get as getHolidays } from "axios";
import { Holiday } from "#/features/holidays/domain/holiday";
import { BrasilApiDto } from "./brasil-api-dto";
import { BrasilApiMapper } from "./brasil-api-mapper";

export class BrasilApiHolidayProvider implements HolidayProvider {
    constructor(
        private readonly url: string
    ) {}

    async get(year: number): Promise<Holiday[]> {
        const res = await getHolidays<BrasilApiDto[]>(`${this.url}/api/feriados/v1/${year}`);

        return res.data.map(BrasilApiMapper.toDomain);
    }
}