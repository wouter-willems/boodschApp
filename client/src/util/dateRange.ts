export function isValidDateRange(sinceDate: Date, beforeDate: Date) {
	if (!sinceDate || !beforeDate) {
		return true;
	}
	return sinceDate <= beforeDate;
}

export function isDateInBetweenRange(dateToCheck: Date, startDate: Date, endDate: Date): boolean {
	return dateToCheck >= startDate && dateToCheck <= endDate ? true : false;
}
