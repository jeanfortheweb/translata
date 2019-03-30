import { LocaleOptions } from './locale';
import { Middleware } from '..';

export interface Translations {
  [key: string]: string;
}

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
