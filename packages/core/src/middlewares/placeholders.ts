import { LocaleOptions } from './locale';
import { Middleware } from '..';

export interface PlaceholderOptions extends LocaleOptions {
  values?: { [key: string]: any };
}

export function withPlaceholders(
  values: PlaceholderOptions['values'] = {},
): Middleware<PlaceholderOptions> {
  return next => (id, options) => {
    const translated = next(id, options);
    const merged = {
      ...values,
      ...options.values,
    };

    if (translated) {
      return Object.entries(merged).reduce(
        (replaced, [name, value]) =>
          replaced.replace(
            `\{\{${name}\}\}`,
            typeof value === 'function' ? value() : value,
          ),
        translated,
      );
    }

    return translated;
  };
}
