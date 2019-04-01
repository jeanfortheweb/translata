import { LocaleOptions } from './locale';
import { Middleware } from '..';

/**
 * Enables logging of failed translations.
 * Failed translations are logged using `console.warn`. This behavior can be changed by passing a
 * custom logger function, which will receive the arguments which has been passed to the translator
 * function.
 *
 * @example
 * ```
 * const _ = createTranslator(
 *    withLogger()
 * );
 *
 * _('missing.id', { locale: 'en' }); // Will log "Missing translation for 'missing.id' on locale 'en'
 * ```
 *
 * @example
 * ```
 * const _ = createTranslator(
 *    withLogger((id, options) => { console.error(id) })
 * );
 *
 * _('missing.id', { locale: 'en' }); // Will log "missing.id"
 * ```
 * @param logger Logger function to use.
 */
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

/**
 * Enables fallback translations using the given fallback function. This function should return a fallback
 * translation string based on the arguments which has been passed to the translator function.
 *
 * @example
 * ```
 * const _ = createTranslator(
 *    withFallbackTranslation((id) => `Unable to translate ${id}`)
 * );
 *
 * _('missing.id'); // === 'Unable to translate missing.id"
 * ```
 *
 * @param translate Fallback translation function.
 */
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
