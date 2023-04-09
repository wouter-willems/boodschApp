import { stringIsSetAndFilled } from './values';
import { Address } from '#/models/address.model';

// return: street name + number, + postal code + City
export function createAddressLine(address: Address): string {
	const addressLine1 = address.AddressLine1;
	const addressLine3 = address.AddressLine3;
	const street = address.Street;
	const numberFull = address.NumberFull;
	const zipCode = address.ZipCode;
	const city = address.City;
	if (stringIsSetAndFilled(addressLine1)) {
		if (stringIsSetAndFilled(addressLine3)) {
			return addressLine1 + ', ' + addressLine3;
		} else {
			return addressLine1;
		}
	} else {
		let newAddressLine: string;
		newAddressLine = street.concat(' ' + numberFull);
		if (newAddressLine.trim().length > 0) {
			newAddressLine = newAddressLine.trim().concat(', ' + zipCode);
		} else {
			newAddressLine = zipCode;
		}
		newAddressLine = newAddressLine.trim().concat(' ' + city);
		return newAddressLine;
	}
}
