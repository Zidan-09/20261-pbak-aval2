import { FastifyReply, FastifyRequest } from "fastify";

export const successHandler = async (
  _request: FastifyRequest,
  _reply: FastifyReply,
  payload: unknown,
) => {
  if (payload && typeof payload === "object" && "success" in payload) {
    return payload;
  }

  return {
    success: true,
    data: payload !== undefined ? payload : null,
  };
};
