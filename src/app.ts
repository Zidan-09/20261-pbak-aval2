import Fastify from "fastify";
import { errorHandler } from "./shared/infrastructure/presentation/error-handler";
import { holidayRoutes } from "./features/holidays/infrastructure/routes/get-holidays-route";
import { tripRoutes } from "./features/trip/infrastructure/routes/trip-routes";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });
  app.setErrorHandler(errorHandler);
  app.get("/health", async () => {
    return {
      status: "ok",
    };
  });

  app.register(holidayRoutes, {
    prefix: "/holidays",
  });

  app.register(tripRoutes, {
    prefix: "/trips",
  });

  return app;
}
