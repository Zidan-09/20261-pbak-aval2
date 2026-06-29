import { GetHolidaysInput } from "#/features/holidays/application/input/get-holidays";
import { GetHolidaysOutput } from "#/features/holidays/application/output/get-holidays";
import { Holiday } from "#/features/holidays/domain/holiday";
import { GetHolidaysResponse } from "../dto/response/get-holidays";
import { HolidayDto } from "../dto/response/holiday-dto";

export class GetHolidaysMapper {
    static toInput(year: number): GetHolidaysInput {
        return {
            year
        }
    }

    static toResponse(output: GetHolidaysOutput): GetHolidaysResponse {
        return {
            holidays: output.holidays.map(this.toDto)
        }
    }

    private static toDto(holiday: Holiday): HolidayDto {
        return {
            date: holiday.getDate().toISOString(),
            name: holiday.getName(),
            type: holiday.getType()
        }
    }
}