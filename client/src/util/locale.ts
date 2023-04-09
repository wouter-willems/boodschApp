import { de, el, enGB, enUS, es, fr, nl, pt } from 'date-fns/locale';

const locales = { nl, de, fr, es, pt, el, enGB, enUS };

export function getLocale() {
	return locales[window['__localeId__']];
}
