import { HolidaySync } from "#/features/holidays/domain/holiday-sync";
import { HolidaySync as PrismaHolidaySync } from "#/generated/prisma/client";

export class HolidaySyncMapper {
    static toDomain(entity: PrismaHolidaySync) {
        return new HolidaySync(
            entity.year,
            entity.syncedAt
        );
    }

    static toPersistence(domain: HolidaySync): PrismaHolidaySync {
        return {
            year: domain.getYear(),
            syncedAt: domain.getSyncedAt()
        }
    }
}