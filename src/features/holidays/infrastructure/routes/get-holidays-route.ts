import { FastifyInstance } from "fastify";
import { makeGetHolidayController } from "../../main/make-get-holiday-controller";

export async function holidayRoutes(app: FastifyInstance) {
    const controller = makeGetHolidayController();

    app.get(
        "/:year",
        controller.handle.bind(controller)
    );
}