import { getLocale } from './locale';

export function amountToString(amount: number): string {
	if (amount === undefined) {
		return '0.00';
	}
	if (isNaN(amount)) {
		return '0.00';
	}

	return (amount / 100).toFixed(2);
}

export function formatAmount(amount: string): number {
	if (!amount) {
		return 0;
	}

	if (amount.replace(/^\s+|\s+$/g, '') === '') {
		return 0;
	}

	if (!parseFloat(amount.replace(/,/g, '.'))) {
		return 0;
	}

	const commasToPeriods = amount.replace(/,/g, '.');
	const toCents = parseFloat(commasToPeriods) * 100.0;
	const roundedCents = Math.round(toCents);
	const parsed = parseInt(roundedCents.toString(), 10);

	if (isNaN(parsed)) {
		return 0;
	}

	return parsed;
}

export function getNumbersList(start: number, end: number): number[] {
	const list = [];
	for (let i = start; i <= end; i++) {
		list.push(i);
	}
	return list;
}

export function roundToX(num: number, amountOfDecimals: number): number {
	return Math.round((num + Number.EPSILON) * Math.pow(10, amountOfDecimals)) / Math.pow(10, amountOfDecimals);
}

export function stringifyAmountWithCurrency(input: string | number, currencyCode: string, amountOfDecimals = 2) {
	const locale = getLocale() ?? 'en-US';
	return Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode, maximumFractionDigits: amountOfDecimals }).format(
		Number(input),
	);
}

export function stringifyAmount(input: string | number, amountOfDecimals = 2) {
	const locale = getLocale() ?? 'en-US';
	return Intl.NumberFormat(locale, { maximumFractionDigits: amountOfDecimals, minimumFractionDigits: 2 }).format(Number(input));
}

export function padNumber(n: number): string {
	return String(n < 10 ? '0' + n : n);
}

export function sumOfArrayOfNumbers(numbers: Array<number>): number {
	return numbers.reduce((acc, cur) => acc + cur, 0);
}

export function commasToDots(input: string): string {
	return input?.replace(/,/g, '.');
}
