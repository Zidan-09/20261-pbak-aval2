export class HolidaySync {
    constructor(
        private readonly year: number,
        private syncedAt: Date
    ) {}

    getYear(): number {
        return this.year;
    }

    getSyncedAt(): Date {
        return this.syncedAt;
    }

    setSyncedAt(date: Date) {
        this.syncedAt = date;
    }
}