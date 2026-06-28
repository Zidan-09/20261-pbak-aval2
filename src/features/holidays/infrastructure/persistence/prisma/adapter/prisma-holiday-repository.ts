import { Holiday } from "#/features/holidays/domain/holiday";
import { HolidayRepository } from "#/features/holidays/domain/repository/holiday-repository";
import { PrismaClient } from "#/generated/prisma/client";
import { HolidayMapper } from "../mapper/holiday-mapper";

export class PrismaHolidayRepository implements HolidayRepository {
    constructor(
        private readonly prisma: PrismaClient
    ) {}

    async get(year: number): Promise<Holiday[]> {
        const holidays = await this.prisma.holiday.findMany({
            where: {
                date: {
                    gte: new Date(year, 0, 1),
                    lt: new Date(year + 1, 0, 1)
                }
            },
            orderBy: {
                date: "asc"
            }
        });

        return holidays.map(HolidayMapper.toDomain);
    }

    async save(holiday: Holiday): Promise<void> {
        const data = HolidayMapper.toPersistence(holiday);

        await this.prisma.holiday.upsert({
            where: {
                date_name: {
                    date: holiday.getDate(),
                    name: holiday.getName()
                }
            },
            create: data,
            update: data
        });
    }

    async saveAll(holidays: Holiday[]): Promise<void> {
        const data = holidays.map(HolidayMapper.toPersistence);

        await this.prisma.holiday.createMany({
            data,
            skipDuplicates: true
        });
    }
}