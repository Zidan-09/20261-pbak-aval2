import { PrismaHolidayRepository } from "../infrastructure/persistence/prisma/adapter/prisma-holiday-repository";
import { PrismaHolidaySyncRepository } from "../infrastructure/persistence/prisma/adapter/prisma-holiday-sync-repository";
import { BrasilApiHolidayProvider } from "../infrastructure/gateway/brasil-api/brasil-api-holiday-provider";
import { GetHolidaysUseCase } from "../application/use-cases/get-holidays";
import { GetHolidaysController } from "../infrastructure/controller/get-holidays-controller";
import { prisma } from "#/shared/infrastructure/persistence/prisma/prisma";
import { env } from "#/config/env";

export function makeGetHolidayController() {
    const repository = new PrismaHolidayRepository(prisma);
    const syncRepository = new PrismaHolidaySyncRepository(prisma);
    const provider = new BrasilApiHolidayProvider(env.HOLIDAYS_API_BASE_URL);

    const useCase = new GetHolidaysUseCase(
        repository,
        syncRepository,
        provider
    );

    return new GetHolidaysController(useCase);
}