import { describe, it, expect } from "vitest";
import Fastify from "fastify";
import { ZodError } from "zod";
import { errorHandler } from "../../../src/shared/http/error-handler";
import { DomainError } from "../../../src/shared/domain/error/domainError";

class FakeNotFoundError extends DomainError {
  constructor() {
    super("TRIP_REQUEST_NOT_FOUND", "Mocked not found message");
  }
}

describe("Error Handler", () => {
  it("must format Zod errors correctly with status 400", async () => {
    const app = Fastify();
    app.setErrorHandler(errorHandler);

    app.get("/test-zod", async () => {
      throw new ZodError([]);
    });

    const response = await app.inject({ method: "GET", url: "/test-zod" });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation error: invalid input data",
      },
    });
  });

  it("must format DomainErrors mapped correctly (ex: 404 Not Found)", async () => {
    const app = Fastify();
    app.setErrorHandler(errorHandler);

    app.get("/test-domain", async () => {
      throw new FakeNotFoundError();
    });

    const response = await app.inject({ method: "GET", url: "/test-domain" });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      success: false,
      error: {
        code: "TRIP_REQUEST_NOT_FOUND",
        message: "Mocked not found message",
      },
    });
  });

  it("must return 500 for generic errors (Internal Server Error)", async () => {
    const app = Fastify();
    app.setErrorHandler(errorHandler);

    app.get("/test-internal", async () => {
      throw new Error("Explodiu o banco de dados!");
    });

    const response = await app.inject({ method: "GET", url: "/test-internal" });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected application error occurred",
      },
    });
  });
});
