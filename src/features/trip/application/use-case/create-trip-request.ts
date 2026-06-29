import { HolidaySyncService } from "#/features/holidays/application/service/holiday-sync-service";
import { HolidayRepository } from "#/features/holidays/domain/repository/holiday-repository";
import { UseCase } from "#/shared/application/use-case/usecase";
import { HolidayTripNotAllowedError } from "../../domain/error/holiday-trip-not-allowed-error";
import { InvalidPassengerCountError } from "../../domain/error/invalid-passenger-count-error";
import { ReturnDateBeforeDepartureError } from "../../domain/error/return-date-before-departure-error";
import { SameOriginDestinationError } from "../../domain/error/same-origin-destination-error";
import { TripAlreadyExistsError } from "../../domain/error/trip-already-exists-error";
import { TripRepository } from "../../domain/repository/trip-repository";
import { Trip } from "../../domain/trip";
import { CreateTripRequestInput } from "../input/create-trip-request";
import { CreateTripRequestOutput } from "../output/create-trip-request";

export class CreateTripRequestUseCase implements UseCase<
  CreateTripRequestInput,
  Promise<CreateTripRequestOutput>
> {
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly holidayRepository: HolidayRepository,
    private readonly holidaySyncService: HolidaySyncService,
  ) {}

  async execute(
    input: CreateTripRequestInput,
  ): Promise<CreateTripRequestOutput> {
    await this.ensureHolidaySync(input.departureAt);

    await this.validateIfAlreadyRegistered(input);

    await this.validateDate(input.departureAt);

    this.validateReturnDate(input.departureAt, input.returnAt);

    this.validatePassengerCount(input.passengerCount);

    this.validateTripDestination(input.origin, input.destination);

    const trip = Trip.create(
      input.requesterName,
      input.origin,
      input.destination,
      input.departureAt,
      input.returnAt,
      input.purpose,
      input.passengerCount,
    );

    await this.tripRepository.save(trip);

    return { trip };
  }

  private async validateIfAlreadyRegistered(input: CreateTripRequestInput) {
    const exists = await this.tripRepository.checkIfExists(
      input.requesterName,
      input.origin,
      input.destination,
      input.departureAt,
      input.returnAt,
    );

    if (exists) throw new TripAlreadyExistsError();
  }

  private async validateDate(departureAt: Date) {
    const exists = await this.holidayRepository.existsByDate(departureAt);

    if (exists) throw new HolidayTripNotAllowedError();
  }

  private validateReturnDate(departureAt: Date, returnAt: Date) {
    if (returnAt.getTime() <= departureAt.getTime())
      throw new ReturnDateBeforeDepartureError();
  }

  private validatePassengerCount(passengerCount: number) {
    if (passengerCount < 0) throw new InvalidPassengerCountError();
  }

  private validateTripDestination(origin: string, destination: string) {
    if (origin.trim().toLowerCase() === destination.trim().toLowerCase())
      throw new SameOriginDestinationError();
  }

  private async ensureHolidaySync(date: Date): Promise<void> {
    await this.holidaySyncService.ensureSync(date.getFullYear());
  }
}
