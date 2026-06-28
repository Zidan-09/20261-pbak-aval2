import { describe, it, expect } from "vitest";
import Fastify from "fastify";
import { successHandler } from "../../../src/shared/http/success-handler"; // Ajuste o caminho se necessário

describe("Success Handler (preSerialization hook)", () => {
  it("must encapsulate the success response in the standard format", async () => {
    const app = Fastify();

    app.addHook("preSerialization", successHandler);

    app.get("/test-success", async () => {
      return { id: 1, name: "John Doe" };
    });

    const response = await app.inject({
      method: "GET",
      url: "/test-success",
    });

    expect(response.statusCode).toBe(200);
    // Verifica se envelopou no formato da prova
    expect(response.json()).toEqual({
      success: true,
      data: { id: 1, name: "John Doe" },
    });
  });

  it("must not change the response if it is already an error object (success: false)", async () => {
    const app = Fastify();
    app.addHook("preSerialization", successHandler);

    app.get("/test-error", async () => {
      return {
        success: false,
        error: { code: "ANY_ERROR", message: "Any message" },
      };
    });

    const response = await app.inject({
      method: "GET",
      url: "/test-error",
    });

    expect(response.statusCode).toBe(200);
    // Verifica se manteve intacto
    expect(response.json()).toEqual({
      success: false,
      error: { code: "ANY_ERROR", message: "Any message" },
    });
  });
});
