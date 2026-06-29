import { HolidaySync } from "#/features/holidays/domain/holiday-sync";
import { HolidaySyncRepository } from "#/features/holidays/domain/repository/holiday-sync-repository";
import { PrismaClient } from "#/generated/prisma/client";
import { HolidaySyncMapper } from "../mapper/holiday-sync-mapper";

export class PrismaHolidaySyncRepository implements HolidaySyncRepository {
    constructor(
        private readonly prisma: PrismaClient
    ) {}

    async get(year: number): Promise<HolidaySync | null> {
        const sync = await this.prisma.holidaySync.findUnique({
            where: {
                year
            }
        });

        return sync ? HolidaySyncMapper.toDomain(sync) : null;
    }

    async save(holidaySync: HolidaySync): Promise<void> {
        const data = HolidaySyncMapper.toPersistence(holidaySync);

        await this.prisma.holidaySync.upsert({
            where: {
                year: holidaySync.getYear()
            },
            create: data,
            update: data
        })
    }
}