export const toStartOfDay = (date: string | Date): Date => {
    const parsed = new Date(date);
    parsed.setHours(0, 0, 0, 0);
    return parsed;
};

export const isBeforeToday = (date: string | Date): boolean => {
    const today = toStartOfDay(new Date());
    return toStartOfDay(date) < today;
};

export const isAfter = (date: string | Date, comparedTo: string | Date): boolean => {
    return toStartOfDay(date) > toStartOfDay(comparedTo);
};

export const datesOverlap = (
    startA: string | Date,
    endA: string | Date,
    startB: string | Date,
    endB: string | Date
): boolean => {
    return toStartOfDay(startA) <= toStartOfDay(endB) && toStartOfDay(endA) >= toStartOfDay(startB);
};
