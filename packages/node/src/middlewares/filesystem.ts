import {
  Middleware,
  LocaleOptions,
  withTranslations,
  Translations,
  combineMiddlewares,
} from '@translata/core';
import { readFileSync } from 'fs';
import { relative } from 'path';

function load(path: string) {
  const loader = [
    {
      supported: path.endsWith('.json'),
      load: (path: string) => require(path),
    },
    {
      supported: path.endsWith('.yml') || path.endsWith('.yaml'),
      load: (path: string) => {
        return require('yaml').parse(readFileSync(path).toString());
      },
    },
  ].find(({ supported }) => supported);

  if (loader === undefined) {
    throw new Error(`File type for ${path} is not supported.`);
  }

  return loader.load(path);
}

function prefix(namespace: string, translations: Translations) {
  return Object.entries(translations).reduce(
    (prefixed, [name, value]) => ({
      ...prefixed,
      [`${namespace}.${name}`]: value,
    }),
    {},
  );
}

function pattern(pattern: string): [string, string[]] {
  let names: string[] = [];

  const regex = pattern
    .replace(/\//g, '\\/')
    .replace(/\./g, '\\.')
    .replace(/\{\{(namespace|locale)\}\}/g, (_, name) => {
      names.push(name);
      return '(.+?)';
    });

  return [regex, names];
}

/**
 * Injects translation strings using the given file for the given locale.
 * JSON and YAML files are currently supported.
 *
 * @param locale Locale to set translations for.
 * @param path Path to translation file.
 */
export function withTranslationFile(
  locale: string,
  path: string,
): Middleware<LocaleOptions> {
  return withTranslations(locale, load(path));
}

/**
 * Options used by the `withTranslationDirectory` middleware.
 *
 * @see withTranslationDirectory
 */
export interface TranslationDirectoryOptions {
  /**
   * Custom pattern for resolving translation files
   * inside a directory.
   *
   * @default {{namespace}}.{{locale}}.(json|yaml|yml)
   */
  pattern?: string;
}

/**
 * Injects translation strings by scanning the given directory for translation files.
 *
 * @param directory Directory to scan.
 */
export function withTranslationDirectory(
  directory: string,
): Middleware<LocaleOptions>;

/**
 * Injects translation strings by scanning the given directory for translation files and
 * custom options.
 *
 * Currently, only the pattern for file resolving can be customized.
 *
 * @param directory Directory to scan.
 * @param options Options.
 */
export function withTranslationDirectory(
  directory: string,
  options: TranslationDirectoryOptions,
): Middleware<LocaleOptions>;

export function withTranslationDirectory(
  directory: string,
  options: TranslationDirectoryOptions = {},
): Middleware<LocaleOptions> {
  const glob = require('glob');
  const sync = glob.sync as (pattern: string, options: any) => string[];
  const [regex, names] = pattern(
    options.pattern || '{{namespace}}.{{locale}}.(json|yaml|yml)',
  );

  return combineMiddlewares(
    ...sync('**/*', {
      cwd: directory,
      absolute: true,
    })
      .map(path => ({ path, match: relative(directory, path).match(regex) }))
      .filter(({ match }) => match !== null)
      .map(({ path, match }) => {
        const namespace = (match as string[])[names.indexOf('namespace') + 1];
        const locale = (match as string[])[names.indexOf('locale') + 1];
        const translations =
          names.length === 1 ? load(path) : prefix(namespace, load(path));

        return withTranslations(locale, translations);
      }),
  );
}
