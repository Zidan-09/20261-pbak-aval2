import { z } from "zod";

export const createTripRequestSchema = z.object({
  requesterName: z.string().min(1, "Name is required"),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  departureAt: z.string().datetime(), // Garante formato de data ISO
  returnAt: z.string().datetime(),
  purpose: z.string().min(1, "Purpose is required"),
  passengerCount: z.number().int().positive(),
});

export type CreateTripRequestBody = z.infer<typeof createTripRequestSchema>;
