import { LocaleOptions } from './locale';
import { Middleware } from '..';

export interface ValueCallback<Context> {
  (values: Context): string;
}
export type ValueMap<Context> = {
  [key: string]: string | ValueCallback<Context>;
};

export interface PlaceholderOptions<
  Values extends ValueMap<Context> = {},
  Context = any
> extends LocaleOptions {
  values?: Values;
  context?: Context;
}

export function withPlaceholders(): Middleware<PlaceholderOptions>;
export function withPlaceholders<Context>(
  values: ValueMap<Context>,
): Middleware<PlaceholderOptions<typeof values, Context>>;

export function withPlaceholders(values = {}): Middleware<PlaceholderOptions> {
  return next => (id, options) => {
    const translated = next(id, options);
    const merged = {
      ...values,
      ...options.values,
    };

    if (translated !== undefined) {
      return Object.entries(merged).reduce(
        (replaced, [name, value]) =>
          replaced.replace(
            `\{\{${name}\}\}`,
            typeof value === 'function' ? value(options.context) : value,
          ),
        translated,
      );
    }

    return translated;
  };
}

export interface CountableOptions {
  count?: number;
}

export function withPluralizer(): Middleware<
  CountableOptions & PlaceholderOptions
> {
  return next => (id, options) => {
    const translated = next(id, {
      ...options,
      values: {
        ...options.values,
        count: options.count,
      },
    });

    if (options.count !== undefined && translated !== undefined) {
      const strings = translated
        .split(/\s+\|\|\s+/)
        .map(partial => partial.trim());

      const [none] = strings;
      const [, one = none] = strings;
      const [, , many = one] = strings;

      if (options.count === 0) {
        return none;
      }

      if (options.count === 1) {
        return one;
      }

      return many;
    }

    return translated;
  };
}
