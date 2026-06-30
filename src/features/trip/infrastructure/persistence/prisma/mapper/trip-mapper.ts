import { Trip as PrismaTrip, TripStatus as PrismaTripStatus } from "#/generated/prisma/client";
import { Trip } from "#/features/trip/domain/trip";
import { TripStatus } from "#/features/trip/domain/tripStatus";

export class TripMapper {
    static toDomain(entity: PrismaTrip) {
        return Trip.restore(
            entity.id,
            entity.requesterName,
            entity.origin,
            entity.destination,
            entity.departureAt,
            entity.returnAt,
            entity.purpose,
            entity.passengerCount,
            this.convertEnumToDomain(entity.status),
            entity.createdAt
        );
    }

    static toPersistence(domain: Trip): PrismaTrip {
        return {
            id: domain.getId(),
            requesterName: domain.getRequesterName(),
            origin: domain.getOrigin(),
            destination: domain.getDestionation(),
            departureAt: domain.getDepartureDate(),
            returnAt: domain.getReturnDate(),
            purpose: domain.getPurpose(),
            passengerCount: domain.getPassengerCount(),
            status: this.convertEnumToPersistence(domain.getStatus()),
            createdAt: domain.getCreatedDate()
        }
    }

    private static convertEnumToDomain(value: PrismaTripStatus): TripStatus {
        switch (value) {
            case "PENDING":
                return TripStatus.PENDING;

            case "CANCELLED":
                return TripStatus.CANCELED;
        }
    }

    private static convertEnumToPersistence(value: TripStatus): PrismaTripStatus {
        switch (value) {
            case TripStatus.PENDING:
                return "PENDING"

            case TripStatus.CANCELED:
                return "CANCELLED"
        }
    }
}