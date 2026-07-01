import { beforeEach, describe, expect, it, vi } from "vitest";
import { FastifyReply, FastifyRequest } from "fastify";

import { CancelTripRequestByIdController } from "#/features/trip/infrastructure/controller/cancel-by-id-controller.ts";
import { CancelTripRequestByIdMapper } from "#/features/trip/infrastructure/presentation/mapper/cancel-by-id-mapper.ts";
import { CancelTripRequestByIdUseCase } from "#/features/trip/application/use-case/cancel-by-id.ts";
import { SuccessResponse } from "#/shared/infrastructure/presentation/success-response.ts";

describe("CancelTripRequestByIdController", () => {
    const makeRequest = (tripRequestId = "trip-1") =>
        ({
            params: {
                tripRequestId
            }
        } as unknown as FastifyRequest<{ Params: { tripRequestId: string } }>);

    const makeReply = () =>
        ({
            status: vi.fn().mockReturnThis(),
            send: vi.fn()
        } as unknown as FastifyReply);

    let useCase: CancelTripRequestByIdUseCase;
    let controller: CancelTripRequestByIdController;

    beforeEach(() => {
        vi.restoreAllMocks();

        useCase = {
            execute: vi.fn()
        } as unknown as CancelTripRequestByIdUseCase;

        controller = new CancelTripRequestByIdController(useCase);
    });

    it("should execute use case and send success response", async () => {
        const request = makeRequest();
        const reply = makeReply();

        const output = {
            trip: {
                id: "trip-1"
            }
        };

        vi.spyOn(CancelTripRequestByIdMapper, "toInput")
            .mockReturnValue({
                tripRequestId: "trip-1"
            });

        vi.spyOn(CancelTripRequestByIdMapper, "toResponse")
            .mockReturnValue(output as never);

        vi.mocked(useCase.execute).mockResolvedValue(output as never);

        const successSpy = vi
            .spyOn(SuccessResponse, "send")
            .mockReturnValue(undefined as never);

        await controller.handle(request, reply);

        expect(CancelTripRequestByIdMapper.toInput)
            .toHaveBeenCalledWith(request.params);

        expect(useCase.execute)
            .toHaveBeenCalledWith({
                tripRequestId: "trip-1"
            });

        expect(successSpy)
            .toHaveBeenCalledOnce();

        expect(successSpy)
            .toHaveBeenCalledWith(reply, output);
    });

    it("should propagate validation errors", async () => {
        const request = makeRequest();
        const reply = makeReply();

        vi.spyOn(CancelTripRequestByIdMapper, "toInput")
            .mockImplementation(() => {
                throw new Error("Invalid trip request id");
            });

        await expect(
            controller.handle(request, reply)
        ).rejects.toThrow("Invalid trip request id");

        expect(useCase.execute).not.toHaveBeenCalled();
    });

    it("should propagate use case errors", async () => {
        const request = makeRequest();
        const reply = makeReply();

        vi.spyOn(CancelTripRequestByIdMapper, "toInput")
            .mockReturnValue({
                tripRequestId: "trip-1"
            });

        vi.mocked(useCase.execute)
            .mockRejectedValue(new Error("Unexpected error"));

        await expect(
            controller.handle(request, reply)
        ).rejects.toThrow("Unexpected error");
    });
});
