import { Holiday } from "#/features/holidays/domain/holiday";
import { randomUUID } from "crypto";
import { BrasilApiDto } from "./brasil-api-dto";

export class BrasilApiMapper {
    static toDomain(dto: BrasilApiDto): Holiday {
        return new Holiday(
            randomUUID(),
            new Date(dto.date),
            dto.name,
            dto.type
        );
    }
}