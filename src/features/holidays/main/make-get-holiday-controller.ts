import { PrismaHolidayRepository } from "../infrastructure/persistence/prisma/adapter/prisma-holiday-repository";
import { BrasilApiHolidayProvider } from "../infrastructure/gateway/brasil-api/brasil-api-holiday-provider";
import { GetHolidaysUseCase } from "../application/use-cases/get-holidays";
import { GetHolidaysController } from "../infrastructure/controller/get-holidays-controller";
import { prisma } from "#/shared/infrastructure/persistence/prisma/prisma";

export function makeGetHolidayController() {
    const repository = new PrismaHolidayRepository(prisma);
    const provider = new BrasilApiHolidayProvider();

    const useCase = new GetHolidaysUseCase(
        repository,
        provider
    );

    return new GetHolidaysController(useCase);
}