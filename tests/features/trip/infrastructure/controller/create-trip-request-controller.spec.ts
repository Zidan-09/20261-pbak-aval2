import { beforeEach, describe, expect, it, vi } from "vitest";
import { FastifyReply, FastifyRequest } from "fastify";

import { CreateTripRequestController } from "#/features/trip/infrastructure/controller/create-trip-request-controller.ts";
import { CreateTripRequestMapper } from "#/features/trip/infrastructure/presentation/mapper/create-trip-request-mapper.ts";
import { CreateTripRequestUseCase } from "#/features/trip/application/use-case/create-trip-request.ts";
import { SuccessResponse } from "#/shared/infrastructure/presentation/success-response.ts";

describe("CreateTripRequestController", () => {
    const makeRequest = () =>
        ({
            body: {
                requesterName: "Samuel Nascimento",
                origin: "Teresina",
                destination: "Fortaleza",
                departureAt: "2026-07-01T10:00:00.000Z",
                returnAt: "2026-07-05T10:00:00.000Z",
                purpose: "Academic event",
                passengerCount: 10,
            }
        } as unknown as FastifyRequest<{
            Body: {
                requesterName: string;
                origin: string;
                destination: string;
                departureAt: string;
                returnAt: string;
                purpose: string;
                passengerCount: number;
            }
        }>);

    const makeReply = () =>
        ({
            status: vi.fn().mockReturnThis(),
            send: vi.fn()
        } as unknown as FastifyReply);

    let useCase: CreateTripRequestUseCase;
    let controller: CreateTripRequestController;

    beforeEach(() => {
        vi.restoreAllMocks();

        useCase = {
            execute: vi.fn()
        } as unknown as CreateTripRequestUseCase;

        controller = new CreateTripRequestController(useCase);
    });

    it("should execute use case and send success response", async () => {
        const request = makeRequest();
        const reply = makeReply();

        const output = {
            trip: {
                id: "trip-1"
            }
        };

        vi.spyOn(CreateTripRequestMapper, "toInput")
            .mockReturnValue({
                requesterName: "Samuel Nascimento",
                origin: "Teresina",
                destination: "Fortaleza",
                departureAt: new Date("2026-07-01T10:00:00.000Z"),
                returnAt: new Date("2026-07-05T10:00:00.000Z"),
                purpose: "Academic event",
                passengerCount: 10
            });

        vi.spyOn(CreateTripRequestMapper, "toResponse")
            .mockReturnValue(output as never);

        vi.mocked(useCase.execute).mockResolvedValue(output as never);

        const successSpy = vi
            .spyOn(SuccessResponse, "send")
            .mockReturnValue(undefined as never);

        await controller.handle(request, reply);

        expect(CreateTripRequestMapper.toInput)
            .toHaveBeenCalledWith(request.body);

        expect(useCase.execute)
            .toHaveBeenCalledWith({
                requesterName: "Samuel Nascimento",
                origin: "Teresina",
                destination: "Fortaleza",
                departureAt: new Date("2026-07-01T10:00:00.000Z"),
                returnAt: new Date("2026-07-05T10:00:00.000Z"),
                purpose: "Academic event",
                passengerCount: 10
            });

        expect(successSpy)
            .toHaveBeenCalledOnce();

        expect(successSpy)
            .toHaveBeenCalledWith(reply, output, 201);
    });

    it("should propagate validation errors", async () => {
        const request = makeRequest();
        const reply = makeReply();

        vi.spyOn(CreateTripRequestMapper, "toInput")
            .mockImplementation(() => {
                throw new Error("Invalid trip request");
            });

        await expect(
            controller.handle(request, reply)
        ).rejects.toThrow("Invalid trip request");

        expect(useCase.execute).not.toHaveBeenCalled();
    });

    it("should propagate use case errors", async () => {
        const request = makeRequest();
        const reply = makeReply();

        vi.spyOn(CreateTripRequestMapper, "toInput")
            .mockReturnValue({
                requesterName: "Samuel Nascimento",
                origin: "Teresina",
                destination: "Fortaleza",
                departureAt: new Date("2026-07-01T10:00:00.000Z"),
                returnAt: new Date("2026-07-05T10:00:00.000Z"),
                purpose: "Academic event",
                passengerCount: 10
            });

        vi.mocked(useCase.execute)
            .mockRejectedValue(new Error("Unexpected error"));

        await expect(
            controller.handle(request, reply)
        ).rejects.toThrow("Unexpected error");
    });
});
