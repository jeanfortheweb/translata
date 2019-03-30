import { LocaleOptions } from './locale';
import { Middleware } from '..';

export function withLogger(
  logger?: (id: string, options: LocaleOptions) => void,
): Middleware<LocaleOptions> {
  return next => (id, options) => {
    const translated = next(id, options);

    if (translated === undefined) {
      if (logger) {
        logger(id, options);
      } else {
        console.warn(
          `Missing translation for "${id}" on locale "${options.locale}"`,
        );
      }
    }

    return translated;
  };
}

export function withFallbackTranslation(
  translate: (id: string, options: LocaleOptions) => string,
): Middleware<LocaleOptions> {
  return next => (id, options) => {
    const translated = next(id, options);

    if (translated === undefined) {
      return translate(id, options);
    }

    return translated;
  };
}
