import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { DomainError } from "../../domain/error/domainError";

const errorStatusMap: Record<string, number> = {
  VALIDATION_ERROR: 400,
  TRIP_REQUEST_NOT_FOUND: 404,
  TRIP_REQUEST_ALREADY_CANCELED: 409,
  HOLIDAY_TRIP_NOT_ALLOWED: 409,
  HOLIDAYS_API_UNAVAILABLE: 502,
  INTERNAL_SERVER_ERROR: 500,
};

type FastifyErrorHandler = Parameters<FastifyInstance["setErrorHandler"]>[0];

export const errorHandler: FastifyErrorHandler = (error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(errorStatusMap["VALIDATION_ERROR"] || 400).send({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation error: invalid input data",
      },
    });
  }

  if (error instanceof DomainError) {
    const code = error.getCode();
    const statusCode = errorStatusMap[code] || 400; // Default para 400 se esquecerem de mapear

    return reply.status(statusCode).send({
      success: false,
      error: {
        code: code,
        message: error.getMessage(),
      },
    });
  }

  console.error("[Internal Server Error]", error);

  return reply.status(errorStatusMap["INTERNAL_SERVER_ERROR"] || 500).send({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected application error occurred",
    },
  });
};
