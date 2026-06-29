import { FastifyReply, FastifyRequest } from "fastify";
import { GetHolidaysUseCase } from "../../application/use-cases/get-holidays";
import { GetHolidaysMapper } from "../presentation/mapper/get-holidays-mapper";
import { SuccessResponse } from "#/shared/infrastructure/presentation/success-response";
import { GetHolidaysValidator } from "../middleware/get-holidays";

interface Params {
    year: string;
}

export class GetHolidaysController {
    constructor(
        private readonly useCase: GetHolidaysUseCase
    ) {}

    async handle(
        req: FastifyRequest<{ Params: Params }>,
        reply: FastifyReply
    ) {
        const year = GetHolidaysValidator.validateYear(req.params.year);

        const input = GetHolidaysMapper.toInput(year);

        const output = await this.useCase.execute(input);

        const data = GetHolidaysMapper.toResponse(output);

        return SuccessResponse.send(reply, data);
    }
}