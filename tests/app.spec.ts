import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "#/app.ts";

let app: Awaited<ReturnType<typeof buildApp>>;

beforeAll(async () => {
  app = buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("API Context Test (Fastify)", () => {
  it("should return health ok", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toEqual({
      success: true,
      data: {
        status: "ok",
      },
    });
  });
});