import { Middleware } from '..';

export interface LocaleOptions {
  locale?: string;
}

export function withDefaultLocale(locale: string): Middleware<LocaleOptions> {
  return next => (id, options) => {
    return next(id, {
      ...options,
      locale: options.locale || locale,
    });
  };
}

export interface FallbackLocaleOptions extends LocaleOptions {
  fallback?: string;
}

export function withFallbackLocale(
  locale: string,
): Middleware<FallbackLocaleOptions> {
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
