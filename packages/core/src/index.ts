export * from './middlewares';

export type MaybeTranslated = string | undefined;

export interface Translate<MiddlewareOptions> {
  (id: string, options: MiddlewareOptions): MaybeTranslated;
}

export interface Middleware<Options = any> {
  (next: Translate<Options>): Translate<Options>;
}

export interface Translator<Options> {
  (id: string): MaybeTranslated;
  (id: string, options: Options): MaybeTranslated;
}

type ExtractOptions<U> = (U extends Middleware<infer Options>
  ? (k: Options) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never;

/**
 * Creates a new translator function using multiple translator middlewares.
 *
 * Keep in mind that the order of middlewares often matters. As a
 * rule of thumb, the first middlewares should add translation strings to the translator,
 * followed by middlewares to configure or manipulate the locale settings. Middlewares that
 * possibly transform or manipulate the resolved translation string should be the last.
 *
 * @param middlewares Middlewares to use.
 */
export function createTranslator<Middlewares extends Middleware[]>(
  ...middlewares: Middlewares
): Translator<ExtractOptions<Middlewares[number]>> {
  const get = middlewares.reduce(
    (next, current) => current(next),
    (id: string, options: any): MaybeTranslated => undefined,
  );

  return (id: string, options: any = {}) => {
    return get(id, options);
  };
}

export function combineMiddlewares<Middlewares extends Middleware[]>(
  ...middlewares: Middlewares
): Middleware<ExtractOptions<Middlewares[number]>> {
  let forwardedNext: Translate<any>;
  const forward: Middleware = () => (id, options) => forwardedNext(id, options);
  const translator = createTranslator(forward, ...middlewares);

  return next => (id, options) => {
    forwardedNext = next;

    return translator(id, options);
  };
}
