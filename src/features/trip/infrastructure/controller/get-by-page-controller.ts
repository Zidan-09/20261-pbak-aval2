import { FastifyReply, FastifyRequest } from "fastify";
import { SuccessResponse } from "#/shared/infrastructure/presentation/success-response";
import { GetTripRequestsByPageUseCase } from "#/features/trip/application/use-case/get-by-page";
import { GetTripRequestsByPageMapper } from "../presentation/mapper/get-by-page-mapper";
import { GetTripRequestsByPageQuery } from "../presentation/dto/request/get-by-page";

export class GetTripRequestsByPageController {
    constructor(
        private readonly useCase: GetTripRequestsByPageUseCase
    ) {}

    async handle(
        req: FastifyRequest<{ Querystring: GetTripRequestsByPageQuery }>,
        reply: FastifyReply
    ) {
        const input = GetTripRequestsByPageMapper.toInput(req.query);

        const output = await this.useCase.execute(input);

        const data = GetTripRequestsByPageMapper.toResponse(output);

        return SuccessResponse.send(reply, data);
    }
}
