import { TripRepository } from "#/features/trip/domain/repository/trip-repository";
import { Trip } from "#/features/trip/domain/trip";
import { PrismaClient } from "#/generated/prisma/client";
import { TripMapper } from "../mapper/trip-mapper";

export class PrismaTripRepository implements TripRepository {
    constructor(
        private readonly prisma: PrismaClient
    ) {}

    async save(trip: Trip): Promise<void> {
        const data = TripMapper.toPersistence(trip);

        await this.prisma.trip.upsert({
            where: {
                id: trip.getId()
            },
            create: data,
            update: data
        });
    }

    async findById(id: string): Promise<Trip | null> {
        const trip = await this.prisma.trip.findFirst({
            where: {
                id
            }
        });

        return trip ? TripMapper.toDomain(trip) : null;
    }

    async getTripsByPage(page?: number, size?: number): Promise<Trip[]> {
        const trips = await this.prisma.trip.findMany({
            ...(page !== undefined && size !== undefined
                ? {
                    skip: (page - 1) * size,
                    take: size,
                }
                : {}),
        });

        return trips.map(TripMapper.toDomain);
    }

    async checkIfExists(requesterName: string, origin: string, destination: string, departureAt: Date, returnAt: Date): Promise<boolean> {
        const trip = await this.prisma.trip.findFirst({
            where: {
                requesterName,
                origin,
                destination,
                departureAt,
                returnAt
            }
        });

        return trip !== null;
    }
}