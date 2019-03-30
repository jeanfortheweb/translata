import { Middleware, LocaleOptions } from '@translata/core';

export function withSystemLocale(): Middleware<LocaleOptions> {
  const { LC_ALL, LC_MESSAGES, LANG, LANGUAGE } = process.env;

  // istanbul ignore next
  const locale = (LC_ALL || LC_MESSAGES || LANG || LANGUAGE || '')
    .split('_')
    .shift();

  return next => (id, options) => {
    return next(id, {
      ...options,
      locale,
    });
  };
}
