import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "#/generated/prisma/client";
import { env } from "#/config/env";

const connectionString = env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/trip_requests_db";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma }