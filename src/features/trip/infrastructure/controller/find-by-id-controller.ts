import { FastifyReply, FastifyRequest } from "fastify";
import { SuccessResponse } from "#/shared/infrastructure/presentation/success-response";
import { FindTripByIdUseCase } from "#/features/trip/application/use-case/find-by-id";
import { FindTripRequestByIdMapper } from "../presentation/mapper/find-by-id-mapper";
import { FindTripRequestByIdParams } from "../presentation/dto/request/find-by-id";

export class FindTripRequestByIdController {
    constructor(
        private readonly useCase: FindTripByIdUseCase
    ) {}

    async handle(
        req: FastifyRequest<{ Params: FindTripRequestByIdParams }>,
        reply: FastifyReply
    ) {
        const input = FindTripRequestByIdMapper.toInput(req.params);

        const output = await this.useCase.execute(input);

        const data = FindTripRequestByIdMapper.toResponse(output);

        return SuccessResponse.send(reply, data);
    }
}
