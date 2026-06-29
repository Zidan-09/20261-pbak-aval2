import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { DomainError } from "../../domain/error/domain-error";

type ErrorCode =
  | "VALIDATION_ERROR"
  | "TRIP_REQUEST_NOT_FOUND"
  | "TRIP_REQUEST_ALREADY_CANCELED"
  | "HOLIDAY_TRIP_NOT_ALLOWED"
  | "HOLIDAYS_API_UNAVAILABLE"
  | "INTERNAL_SERVER_ERROR"
  | "INVALID_PASSENGER_COUNT"
  | "RETURN_DATE_BEFORE_DEPARTURE"
  | "SAME_ORIGIN_DESTINATION"
  | "TRIP_ALREADY_EXISTS";

const errorStatusMap: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  TRIP_REQUEST_NOT_FOUND: 404,
  TRIP_REQUEST_ALREADY_CANCELED: 409,
  HOLIDAY_TRIP_NOT_ALLOWED: 409,
  HOLIDAYS_API_UNAVAILABLE: 502,
  INTERNAL_SERVER_ERROR: 500,
  INVALID_PASSENGER_COUNT: 400,
  RETURN_DATE_BEFORE_DEPARTURE: 400,
  SAME_ORIGIN_DESTINATION: 400,
  TRIP_ALREADY_EXISTS: 409,
};

type FastifyErrorHandler = Parameters<FastifyInstance["setErrorHandler"]>[0];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(errorStatusMap.VALIDATION_ERROR).send({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation error: invalid input data",
      },
    });
  }

  if (error instanceof DomainError) {
    const code = error.getCode() as ErrorCode;
    const statusCode = errorStatusMap[code];

    if (!statusCode) {
      request.log.error(`Unmapped domain error code: ${code}`);
      return reply.status(errorStatusMap.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected application error occurred",
        },
      });
    }

    return reply.status(statusCode).send({
      success: false,
      error: {
        code: code,
        message: error.getMessage(),
      },
    });
  }

  request.log.error(error);

  return reply.status(errorStatusMap.INTERNAL_SERVER_ERROR).send({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected application error occurred",
    },
  });
};
