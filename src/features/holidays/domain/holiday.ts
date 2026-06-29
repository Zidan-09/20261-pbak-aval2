export class Holiday {
    constructor(
        private readonly id: string,
        private readonly date: Date,
        private readonly name: string,
        private readonly type: string
    ) {}

    getId(): string {
        return this.id;
    }

    getDate(): Date {
        return this.date;
    }

    getName(): string {
        return this.name;
    }

    getType(): string {
        return this.type;
    }
}