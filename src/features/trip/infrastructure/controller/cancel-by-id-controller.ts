import { FastifyReply, FastifyRequest } from "fastify";
import { SuccessResponse } from "#/shared/infrastructure/presentation/success-response";
import { CancelTripRequestByIdUseCase } from "#/features/trip/application/use-case/cancel-by-id";
import { CancelTripRequestByIdMapper } from "../presentation/mapper/cancel-by-id-mapper";
import { CancelTripRequestByIdParams } from "../presentation/dto/request/cancel-by-id";

export class CancelTripRequestByIdController {
    constructor(
        private readonly useCase: CancelTripRequestByIdUseCase
    ) {}

    async handle(
        req: FastifyRequest<{ Params: CancelTripRequestByIdParams }>,
        reply: FastifyReply
    ) {
        const input = CancelTripRequestByIdMapper.toInput(req.params);

        const output = await this.useCase.execute(input);

        const data = CancelTripRequestByIdMapper.toResponse(output);

        return SuccessResponse.send(reply, data);
    }
}
