import { beforeEach, describe, expect, it, vi } from "vitest";
import { FastifyReply, FastifyRequest } from "fastify";

import { GetHolidaysController } from "#/features/holidays/infrastructure/controller/get-holidays-controller.ts";
import { GetHolidaysValidator } from "#/features/holidays/infrastructure/middleware/get-holidays.ts";
import { GetHolidaysUseCase } from "#/features/holidays/application/use-cases/get-holidays.ts";
import { SuccessResponse } from "#/shared/infrastructure/presentation/success-response.ts";

describe("GetHolidaysController", () => {

    const makeRequest = (year = "2026") =>
        ({
            params: {
                year
            }
        } as FastifyRequest<{ Params: { year: string } }>);

    const makeReply = () =>
        ({
            status: vi.fn().mockReturnThis(),
            send: vi.fn()
        } as unknown as FastifyReply);

    let useCase: GetHolidaysUseCase;
    let controller: GetHolidaysController;

    beforeEach(() => {
        vi.restoreAllMocks();

        useCase = {
            execute: vi.fn()
        } as unknown as GetHolidaysUseCase;

        controller = new GetHolidaysController(useCase);
    });

    it("should execute use case and send success response", async () => {
        const request = makeRequest();
        const reply = makeReply();

        const output = {
            holidays: []
        };

        vi.spyOn(GetHolidaysValidator, "validateYear")
            .mockReturnValue(2026);

        vi.mocked(useCase.execute).mockResolvedValue(output);

        const successSpy = vi
            .spyOn(SuccessResponse, "send")
            .mockReturnValue(undefined as never);

        await controller.handle(request, reply);

        expect(GetHolidaysValidator.validateYear)
            .toHaveBeenCalledWith("2026");

        expect(useCase.execute)
            .toHaveBeenCalledWith({
                year: 2026
            });

        expect(successSpy)
            .toHaveBeenCalledOnce();

        expect(successSpy)
            .toHaveBeenCalledWith(reply, output);
    });

    it("should propagate validation errors", async () => {
        const request = makeRequest();
        const reply = makeReply();

        vi.spyOn(GetHolidaysValidator, "validateYear")
            .mockImplementation(() => {
                throw new Error("Invalid year");
            });

        await expect(
            controller.handle(request, reply)
        ).rejects.toThrow("Invalid year");

        expect(useCase.execute).not.toHaveBeenCalled();
    });

    it("should propagate use case errors", async () => {
        const request = makeRequest();
        const reply = makeReply();

        vi.spyOn(GetHolidaysValidator, "validateYear")
            .mockReturnValue(2026);

        vi.mocked(useCase.execute)
            .mockRejectedValue(new Error("Unexpected error"));

        await expect(
            controller.handle(request, reply)
        ).rejects.toThrow("Unexpected error");
    });

});