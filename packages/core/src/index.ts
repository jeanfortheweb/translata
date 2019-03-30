export * from './middlewares';

export type MaybeTranslated = string | undefined;

export interface Translate<MiddlewareOptions> {
  (id: string, options: MiddlewareOptions): MaybeTranslated;
}

export interface Middleware<Options = any> {
  (next: Translate<Options>): Translate<Options>;
}

export interface Translator<MiddlewareOptions = any> {
  (id: string): MaybeTranslated;
  (id: string, options: MiddlewareOptions): MaybeTranslated;
}

export function createTranslator(): Translator;

export function createTranslator<Options1>(
  middleware1: Middleware<Options1>,
): Translator<Options1>;

export function createTranslator<Options1, Options2>(
  middleware1: Middleware<Options1>,
  middleware2: Middleware<Options2>,
): Translator<Options1 & Options2>;

export function createTranslator<Options1, Options2, Options3>(
  middleware1: Middleware<Options1>,
  middleware2: Middleware<Options2>,
  middleware3: Middleware<Options3>,
): Translator<Options1 & Options2 & Options3>;

export function createTranslator<Options1, Options2, Options3, Options4>(
  middleware1: Middleware<Options1>,
  middleware2: Middleware<Options2>,
  middleware3: Middleware<Options3>,
  middleware4: Middleware<Options4>,
): Translator<Options1 & Options2 & Options3 & Options4>;

export function createTranslator<
  Options1,
  Options2,
  Options3,
  Options4,
  Options5
>(
  middleware1: Middleware<Options1>,
  middleware2: Middleware<Options2>,
  middleware3: Middleware<Options3>,
  middleware4: Middleware<Options4>,
  middleware5: Middleware<Options5>,
): Translator<Options1 & Options2 & Options3 & Options4 & Options5>;

/**
 * Creates a new translator function using multiple translator middlewares.
 *
 * Keep in mind that the order of middlewares often matters. As a
 * rule of thumb, the first middlewares should add translation string,
 * followed by middlewares to configure the locale.
 *
 * @param middlewares Middlewares.
 */
export function createTranslator(...middlewares: Middleware[]): Translator {
  const get = middlewares.reduce(
    (next, current) => current(next),
    (id: string, options: any): MaybeTranslated => undefined,
  );

  return (id: string, options: any = {}) => {
    return get(id, options);
  };
}
