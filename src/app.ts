import Fastify from "fastify";
import { holidayRoutes } from "./features/holidays/infrastructure/routes/get-holidays-route";

export function buildApp() {
    const app = Fastify({
        logger: true
    });

    app.get("/health", async () => {
        return {
            success: true,
            data: {
                status: "ok"
            }
        }
    });

    app.register(holidayRoutes, {
        prefix: "/holidays"
    })

    return app;
}