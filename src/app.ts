import Fastify from "fastify";
import { errorHandler } from "./shared/http/error-handler";
import { successHandler } from "./shared/http/success-handler";
import { holidayRoutes } from "./features/holidays/infrastructure/routes/get-holidays-route";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });
  app.setErrorHandler(errorHandler);
  app.addHook("preSerialization", successHandler);

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
