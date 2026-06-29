import { Holiday as PrismaHoliday } from "#/generated/prisma/client";
import { Holiday } from "#/features/holidays/domain/holiday";

export class HolidayMapper {
    static toDomain(entity: PrismaHoliday) {
        return new Holiday(
            entity.id,
            entity.date,
            entity.name,
            entity.type
        );
    }

    static toPersistence(domain: Holiday): PrismaHoliday {
        return {
            id: domain.getId(),
            date: domain.getDate(),
            name: domain.getName(),
            type: domain.getType()
        };
    }
}