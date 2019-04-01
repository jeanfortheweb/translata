import { LocaleOptions } from './locale';
import { Middleware } from '..';

/**
 * Defines a translation dictionary.
 * Translation dictionaries cannot be nested.
 */
export interface Translations {
  [key: string]: string;
}

/**
 * Injects the given translation dictionary for the given locale.
 *
 * @param locale Locale for translations.
 * @param translations Translation dictionary.
 */
export function withTranslations(
  locale: string,
  translations: Translations,
): Middleware<LocaleOptions> {
  return next => (id, options) => {
    if (locale === options.locale && translations[id]) {
      return translations[id];
    }

    return next(id, options);
  };
}
