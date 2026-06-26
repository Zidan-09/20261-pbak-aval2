import { UseCase } from "#/shared/application/use-case/usecase";
import { TripRepository } from "../../domain/repository/trip-repository";
import { Trip } from "../../domain/trip";
import { TripStatus } from "../../domain/tripStatus";
import { CreateTripRequestInput } from "../input/create-trip-request";
import { CreateTripRequestOutput } from "../output/create-trip-request";
import { randomUUID } from "crypto"; // Remover quando o método create em Trip for implementado

export class CreateTripRequestUseCase implements UseCase<
  CreateTripRequestInput,
  CreateTripRequestOutput
> {
  constructor(private readonly tripRepository: TripRepository) {}

  execute(input: CreateTripRequestInput): CreateTripRequestOutput {
    // TODO: Validar se data de partida coincide em um feriado nacial através do futuro HollidayRepository (Interface Domínio)
    // TODO: Validar se a entrada recebida já tem cadastro no banco

    this.validateReturnDate(input.departureAt, input.returnAt);

    this.validatePassengerCount(input.passengerCount);

    this.validateTripDestination(input.origin, input.destination);

    // TODO: Implementar métodos estáticos para instanciação e restauração na classe Trip
    const trip = new Trip(
      randomUUID(),
      input.requesterName,
      input.origin,
      input.destination,
      input.departureAt,
      input.returnAt,
      input.purpose,
      input.passengerCount,
      TripStatus.PENDING,
      new Date(),
    );

    this.tripRepository.save(trip);

    return this.buildOutput(trip);
  }

  private validateReturnDate(departureAt: Date, returnAt: Date) {
    // TODO: Implementar Erro personalizado para essa situação
    if (returnAt.getTime() < departureAt.getTime())
      throw new Error("A data de retorno não pode ser antes da data de saída");
  }

  private validatePassengerCount(passengerCount: number) {
    // TODO: Implementar Erro personalizado para essa situação
    if (passengerCount <= 0)
      throw new Error("O número de passageiros não pode ser menor que 0");
  }

  private validateTripDestination(origin: string, destination: string) {
    // TODO: Implementar Erro personalizado para essa situação
    if (
        origin.trim().toLowerCase() ===
        destination.trim().toLowerCase()
    ) throw new Error("O destino não pode ser o mesmo do local de partida")
  }

  private buildOutput(trip: Trip): CreateTripRequestOutput {
    return {
      trip: trip,
    };
  }
}
