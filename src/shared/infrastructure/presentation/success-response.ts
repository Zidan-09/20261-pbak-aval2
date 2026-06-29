import { FastifyReply } from "fastify";

export class SuccessResponse {
    static send<T>(
        reply: FastifyReply, 
        data?: T, 
        status = 200
    ) {
        return reply.status(status).send({
            success: true,
            data
        });
    }
}