import { FastifyInstance } from "fastify";
import { env } from "#/config/env";
import { prisma } from "#/shared/infrastructure/persistence/prisma/prisma";
import { BrasilApiHolidayProvider } from "#/features/holidays/infrastructure/gateway/brasil-api/brasil-api-holiday-provider";
import { HolidaySyncService } from "#/features/holidays/application/service/holiday-sync-service";
import { PrismaHolidayRepository } from "#/features/holidays/infrastructure/persistence/prisma/adapter/prisma-holiday-repository";
import { PrismaHolidaySyncRepository } from "#/features/holidays/infrastructure/persistence/prisma/adapter/prisma-holiday-sync-repository";
import { CreateTripRequestUseCase } from "#/features/trip/application/use-case/create-trip-request";
import { GetTripRequestsByPageUseCase } from "#/features/trip/application/use-case/get-by-page";
import { FindTripByIdUseCase } from "#/features/trip/application/use-case/find-by-id";
import { CancelTripRequestByIdUseCase } from "#/features/trip/application/use-case/cancel-by-id";
import { PrismaTripRepository } from "../persistence/prisma/adapter/prisma-trip-repository";
import { CreateTripRequestController } from "../controller/create-trip-request-controller";
import { GetTripRequestsByPageController } from "../controller/get-by-page-controller";
import { FindTripRequestByIdController } from "../controller/find-by-id-controller";
import { CancelTripRequestByIdController } from "../controller/cancel-by-id-controller";

function buildControllers() {
    const tripRepository = new PrismaTripRepository(prisma);
    const holidayRepository = new PrismaHolidayRepository(prisma);
    const holidaySyncRepository = new PrismaHolidaySyncRepository(prisma);
    const holidayProvider = new BrasilApiHolidayProvider(env.HOLIDAYS_API_BASE_URL);

    const holidaySyncService = new HolidaySyncService(
        holidayProvider,
        holidayRepository,
        holidaySyncRepository
    );

    return {
        createTripRequestController: new CreateTripRequestController(
            new CreateTripRequestUseCase(
                tripRepository,
                holidayRepository,
                holidaySyncService
            )
        ),
        getTripRequestsByPageController: new GetTripRequestsByPageController(
            new GetTripRequestsByPageUseCase(tripRepository)
        ),
        findTripRequestByIdController: new FindTripRequestByIdController(
            new FindTripByIdUseCase(tripRepository)
        ),
        cancelTripRequestByIdController: new CancelTripRequestByIdController(
            new CancelTripRequestByIdUseCase(tripRepository)
        )
    };
}

export async function tripRoutes(app: FastifyInstance) {
    const controllers = buildControllers();

    app.post(
        "/",
        controllers.createTripRequestController.handle.bind(controllers.createTripRequestController)
    );

    app.get(
        "/",
        controllers.getTripRequestsByPageController.handle.bind(controllers.getTripRequestsByPageController)
    );

    app.get(
        "/:tripRequestId",
        controllers.findTripRequestByIdController.handle.bind(controllers.findTripRequestByIdController)
    );

    app.patch(
        "/:tripRequestId/cancel",
        controllers.cancelTripRequestByIdController.handle.bind(controllers.cancelTripRequestByIdController)
    );
}
