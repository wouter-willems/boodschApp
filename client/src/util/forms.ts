import { FormGroup } from '@angular/forms';
import { isEqual } from 'lodash';
import { Observable, Subject } from 'rxjs';

export function subscribeToFormChanges<T>(myForm: FormGroup): Observable<Map<T, { before: any; after: any }>> {
	const subject = new Subject<Map<T, { before: any; after: any }>>();
	let prevFormValue: { [k in string]: any } = myForm.getRawValue();
	myForm.valueChanges.subscribe(async () => {
		const current = myForm.getRawValue();
		// changedValues holds the values that are changed along with what it used to be
		const changedValues: Map<T, { before: any; after: any }> = Object.entries(current)
			.filter(([key, val]) => {
				return !isEqual(prevFormValue?.[key], val);
			})
			.reduce((acc, [key]) => {
				acc.set(key as any as T, { before: prevFormValue?.[key], after: current?.[key] });
				return acc;
			}, new Map<T, { before: any; after: any }>());
		prevFormValue = myForm.getRawValue();

		if (changedValues.size > 0) {
			subject.next(changedValues);
		}
	});

	return subject.asObservable();
}
