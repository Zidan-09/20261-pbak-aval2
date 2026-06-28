import { HolidayProvider } from "#/features/holidays/application/gateway/holiday-provider";
import { get as getHolidays } from "axios";
import { Holiday } from "#/features/holidays/domain/holiday";
import { BrasilApiDto } from "./brasil-api-dto";
import { BrasilApiMapper } from "./brasil-api-mapper";
import { env } from "#/config/env";

export class BrasilApiHolidayProvider implements HolidayProvider {
    async get(year: number): Promise<Holiday[]> {
        const url = env.HOLIDAYS_API_BASE_URL || "https://brasilapi.com.br";

        const res = await getHolidays<BrasilApiDto[]>(`${url}/api/feriados/v1/${year}`);

        return res.data.map(BrasilApiMapper.toDomain);
    }
}