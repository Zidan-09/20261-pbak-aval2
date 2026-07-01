import { beforeEach, describe, expect, it, vi } from "vitest";
import { FastifyReply, FastifyRequest } from "fastify";

import { GetTripRequestsByPageController } from "#/features/trip/infrastructure/controller/get-by-page-controller.ts";
import { GetTripRequestsByPageMapper } from "#/features/trip/infrastructure/presentation/mapper/get-by-page-mapper.ts";
import { GetTripRequestsByPageUseCase } from "#/features/trip/application/use-case/get-by-page.ts";
import { SuccessResponse } from "#/shared/infrastructure/presentation/success-response.ts";

describe("GetTripRequestsByPageController", () => {
    const makeRequest = (page = "1", size = "20") =>
        ({
            query: {
                page,
                size
            }
        } as unknown as FastifyRequest<{ Querystring: { page: string; size: string } }>);

    const makeReply = () =>
        ({
            status: vi.fn().mockReturnThis(),
            send: vi.fn()
        } as unknown as FastifyReply);

    let useCase: GetTripRequestsByPageUseCase;
    let controller: GetTripRequestsByPageController;

    beforeEach(() => {
        vi.restoreAllMocks();

        useCase = {
            execute: vi.fn()
        } as unknown as GetTripRequestsByPageUseCase;

        controller = new GetTripRequestsByPageController(useCase);
    });

    it("should execute use case and send success response", async () => {
        const request = makeRequest();
        const reply = makeReply();

        const output = {
            trips: []
        };

        vi.spyOn(GetTripRequestsByPageMapper, "toInput")
            .mockReturnValue({
                page: 1,
                size: 20
            });

        vi.spyOn(GetTripRequestsByPageMapper, "toResponse")
            .mockReturnValue(output as never);

        vi.mocked(useCase.execute).mockResolvedValue(output as never);

        const successSpy = vi
            .spyOn(SuccessResponse, "send")
            .mockReturnValue(undefined as never);

        await controller.handle(request, reply);

        expect(GetTripRequestsByPageMapper.toInput)
            .toHaveBeenCalledWith(request.query);

        expect(useCase.execute)
            .toHaveBeenCalledWith({
                page: 1,
                size: 20
            });

        expect(successSpy)
            .toHaveBeenCalledOnce();

        expect(successSpy)
            .toHaveBeenCalledWith(reply, output);
    });

    it("should propagate validation errors", async () => {
        const request = makeRequest();
        const reply = makeReply();

        vi.spyOn(GetTripRequestsByPageMapper, "toInput")
            .mockImplementation(() => {
                throw new Error("Invalid query");
            });

        await expect(
            controller.handle(request, reply)
        ).rejects.toThrow("Invalid query");

        expect(useCase.execute).not.toHaveBeenCalled();
    });

    it("should propagate use case errors", async () => {
        const request = makeRequest();
        const reply = makeReply();

        vi.spyOn(GetTripRequestsByPageMapper, "toInput")
            .mockReturnValue({
                page: 1,
                size: 20
            });

        vi.mocked(useCase.execute)
            .mockRejectedValue(new Error("Unexpected error"));

        await expect(
            controller.handle(request, reply)
        ).rejects.toThrow("Unexpected error");
    });
});
