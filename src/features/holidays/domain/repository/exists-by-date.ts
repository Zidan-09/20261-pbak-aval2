export interface ExistsByDate {
    existsByDate(date: Date): Promise<boolean>;
}