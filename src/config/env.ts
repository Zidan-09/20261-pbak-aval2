import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  HOLIDAYS_API_BASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);