export interface CheckIfTripExists {
    checkIfExists(
        requesterName: string,
        origin: string,
        destination: string,
        departureAt: Date,
        returnAt: Date
    ): Promise<boolean>;
}