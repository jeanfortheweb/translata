import { LocaleOptions } from './locale';
import { Middleware } from '..';

/**
 * Defines the signature of a value callback.
 *
 * @see withPlaceholders
 */
export interface ValueCallback<Context> {
  (values: Context): string;
}

/**
 * Defines a map of values for `withPlaceholders`
 *
 * @see withPlaceholders
 */
export type ValueMap<Context> = {
  [key: string]: string | ValueCallback<Context>;
};

/**
 * Translator options used by `withPlaceholders`
 *
 * @see withPlaceholders
 */
export interface PlaceholderOptions<
  Values extends ValueMap<Context> = {},
  Context = any
> extends LocaleOptions {
  values?: Values;
  context?: Context;
}

/**
 * Enables placeholders for translation strings. Placeholders are defined as: `{{placeholdername}}`.
 * To replace these placeholders, pass the `values` option to the translator function.
 *
 * @example
 * ```
 * const _ = createTranslator(
 *    withTranslations('en', {
 *      'example.greeting': 'Hello, {{name}}.'
 *    }),
 *    withPlaceholders()
 * );
 *
 * _('example.greeting', { values: { name: 'John Doe' }});
 * ```
 *
 * @example
 * ```
 * const _ = createTranslator(
 *    withTranslations('en', {
 *      'example.greeting': 'Hello, {{name}}. Today is {{date}}.'
 *    }),
 *    withPlaceholders({
 *      date: (context) => context.toDateString()
 *    })
 * );
 *
 * _('example.greeting', {
 *    context: new Date(),
 *    values: {
 *      name: 'John Doe',
 *    }
 * });
 * ```
 */
export function withPlaceholders(): Middleware<PlaceholderOptions>;

/**
 * Enables placeholders for translation strings including default placeholder values.
 *
 * Placeholders are defined as: `{{placeholdername}}`. To replace these placeholders,
 * pass the `values` option to the translator function.
 *
 * @example
 * ```
 * const _ = createTranslator(
 *    withTranslations('en', {
 *      'example.greeting': 'Hello, {{name}}.'
 *    }),
 *    withPlaceholders()
 * );
 *
 * _('example.greeting', { values: { name: 'John Doe' }});
 * ```
 *
 * @example
 * ```
 * const _ = createTranslator(
 *    withTranslations('en', {
 *      'example.greeting': 'Hello, {{name}}. Today is {{date}}.'
 *    }),
 *    withPlaceholders({
 *      date: (context) => context.toDateString()
 *    })
 * );
 *
 * _('example.greeting', {
 *    context: new Date(),
 *    values: {
 *      name: 'John Doe',
 *    }
 * });
 * ```
 */
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

/**
 * Translator options used by `withPluralizer`.
 *
 * @see withPluralizer
 */
export interface PluralizerOptions {
  /**
   * Count for `withPluralizer`.
   */
  count?: number;
}

/**
 * Enables pluralizable translation strings.
 * The translations string has to be separated up to three times by using `||`.
 * The first section is used when the count is zero, the second one when the count is one and the third
 * is used when count is greater than one. It's not required to define all three sections.
 *
 * To determine the string to use, pass the `count` option in the translator options.
 * The `count` value is also passed to the `values` options of `withPlaceholders`, which allows placeholder
 * replacements for the count inside the sections.
 *
 * @example
 * ```
 * const _  = createTranslator(
 *    withTranslations('en', {
 *      'pluralized.cats': 'no cat || one cat || many cats'
 *    }),
 *    withPluralizer()
 * );
 *
 * _('pluralized.cats', { count: 1 });
 * ```
 * @example
 * ```
 * const _  = createTranslator(
 *    withTranslations('en', {
 *      'pluralized.cats': 'no cat || one cat || {{count}} cats'
 *    }),
 *    withPlaceholders(),
 *    withPluralizer()
 * );
 *
 * _('pluralized.cats', { count: 1 });
 * ```
 */
export function withPluralizer(): Middleware<
  PluralizerOptions & PlaceholderOptions
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
