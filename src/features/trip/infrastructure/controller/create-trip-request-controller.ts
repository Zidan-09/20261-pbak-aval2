import { FastifyReply, FastifyRequest } from "fastify";
import { SuccessResponse } from "#/shared/infrastructure/presentation/success-response";
import { CreateTripRequestUseCase } from "#/features/trip/application/use-case/create-trip-request";
import { CreateTripRequestMapper } from "../presentation/mapper/create-trip-request-mapper";
import { CreateTripRequestBody } from "../presentation/dto/request/create-trip-request";

export class CreateTripRequestController {
    constructor(
        private readonly useCase: CreateTripRequestUseCase
    ) {}

    async handle(
        req: FastifyRequest<{ Body: CreateTripRequestBody }>,
        reply: FastifyReply
    ) {
        const input = CreateTripRequestMapper.toInput(req.body);

        const output = await this.useCase.execute(input);

        const data = CreateTripRequestMapper.toResponse(output);

        return SuccessResponse.send(reply, data);
    }
}
