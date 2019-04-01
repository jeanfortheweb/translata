import { Middleware } from '..';

/**
 * Translator options used by many different translator middlewares.
 */
export interface LocaleOptions {
  /**
   * Sets the locale to used for translation.
   */
  locale?: string;
}

/**
 * Sets a default locale to use when no other is given.
 *
 * @param locale Locale to use.
 */
export function withDefaultLocale(locale: string): Middleware<LocaleOptions> {
  return next => (id, options) => {
    return next(id, {
      ...options,
      locale: options.locale || locale,
    });
  };
}

/**
 * Translator options for `withFallbackLocale`.
 *
 * @see withFallbackLocale
 */
export interface FallbackLocaleOptions {
  /**
   * Fallback locale to use when translation using the current locale resulted
   * in undefined.
   */
  fallback?: string;
}

/**
 * Sets the locale to use when translation using the current locale has failed.
 * The fallback locale can also be set as translator option, which then has priority.
 *
 * @param locale Locale to fallback to.
 */
export function withFallbackLocale(
  locale: string,
): Middleware<FallbackLocaleOptions & LocaleOptions> {
  return next => (id, options) => {
    const translated = next(id, options);

    if (translated === undefined) {
      return next(id, {
        locale: options.fallback || locale,
      });
    }

    return translated;
  };
}
