import Fastify from "fastify";
import { errorHandler } from "./shared/infrastructure/presentation/error-handler";
import { holidayRoutes } from "./features/holidays/infrastructure/routes/get-holidays-route";

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

  return app;
}
