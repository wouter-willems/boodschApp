import { AbstractControl } from '@angular/forms';
import { isNullOrUndefined } from '#/util/values';

export function getMinDateValidator(minDate: Date) {
	return (control: AbstractControl) => {
		if (isNullOrUndefined(control.value)) {
			return;
		}
		const currentDate = new Date(control.value);
		if (currentDate < minDate) {
			return { minDate: control.value };
		}
	};
}

export function getMaxDateValidator(endDate: Date) {
	return (control: AbstractControl) => {
		if (isNullOrUndefined(control.value)) {
			return;
		}
		const currentDate = new Date(control.value);
		if (currentDate > endDate) {
			return { maxDate: control.value };
		}
	};
}
