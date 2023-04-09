import { stringIsSetAndFilled } from '#/util/values';

export function mapObjectValues<O, T>(myObject: O, mapFn: (e: O[keyof O]) => T): Record<keyof O, T> {
	return Object.entries(myObject)
		.map(([key, value]) => {
			return { key, value: mapFn(value) };
		})
		.reduce((acc, cur) => {
			return { ...acc, [cur.key]: cur.value };
		}, {} as Record<keyof O, T>);
}

export function filterEmptyStringValues(object: Record<any, string>): Record<any, string> {
	return Object.entries(object).reduce((acc, cur) => {
		if (stringIsSetAndFilled(cur[1])) {
			return { ...acc, [cur[0]]: cur[1] };
		}
		return acc;
	}, {});
}

export function filterUndefinedValues(object: Record<any, string>): Record<any, string> {
	return Object.entries(object).reduce((acc, cur) => {
		if (cur[1] !== undefined) {
			return { ...acc, [cur[0]]: cur[1] };
		}
		return acc;
	}, {});
}

export function objectToQueryParamString(object: Record<string, string | number>): string {
	const mappedToString = mapObjectValues(object, (e) => e?.toString());
	const filtered = filterEmptyStringValues(mappedToString);
	return Object.entries(filtered)
		.map(([key, val]) => `${key}=${val}`)
		.join('&');
}

function mergeArray(arrA: Array<any>, arrB: Array<any>): Array<any> {
	const arr = new Array(Math.max(arrA.length, arrB.length));

	for (let i = 0; i < arr.length; i++) {
		if (typeof arrA[i] === 'object' && typeof arrB[i] === 'object') {
			arr[i] = deepMerge(arrA[i], arrB[i]);
		} else {
			arr[i] = arrB[i] ?? arrA[i];
		}
	}

	return arr;
}

export function deepMerge<A extends object | Array<any>, B extends object | Array<any>>(objA: A, objB: B): A | B {
	if (Array.isArray(objA) || Array.isArray(objB)) {
		if (Array.isArray(objA) && Array.isArray(objB)) {
			return mergeArray(objA, objB) as A | B;
		}

		// if a and b differ in type, prefer b.
		return objB ?? objA;
	}

	const merged: A | B = {} as A | B;

	const keys = new Set<keyof A | keyof B>([...Object.keys(objA), ...Object.keys(objB)] as Array<keyof A | keyof B>);

	keys.forEach((key) => {
		const a = objA[key as keyof A];
		const b = objB[key as keyof B];

		if (typeof a === 'object' && typeof b === 'object') {
			merged[key as keyof (A | B)] = deepMerge(a as any, b as any) as any;
			return;
		}

		// if a and b differ in type, prefer b.
		merged[key as keyof (A | B)] = (b ?? a) as any;
	});

	return merged;
}
