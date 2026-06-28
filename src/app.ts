import Fastify from "fastify";
import { errorHandler } from "./shared/http/error-handler";
import { successHandler } from "./shared/http/success-handler";

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

  return app;
}
