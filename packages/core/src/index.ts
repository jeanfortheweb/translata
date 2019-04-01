export * from './middlewares';

/**
 * A maybe translated string.
 */
export type MaybeTranslated = string | undefined;

/**
 * Defines the signature of a translation function.
 * A translation function should either return the translated string or undefined.
 */
export interface Translate<MiddlewareOptions> {
  (id: string, options: MiddlewareOptions): MaybeTranslated;
}

/**
 * Defines the signature of a translator middleware.
 *
 * Each middleware has access to the next middleware in chain, the id to translate and the current options
 * passed to the translator function. Middlewares can alter the id and or options for the next middleware.
 */
export interface Middleware<Options = any> {
  (next: Translate<Options>): Translate<Options>;
}

/**
 * Defines the signature of a translator function.
 * A translator function is the result of creating a translator using `createTranslator`
 *
 * @see createTranslator
 */
export interface Translator<Options> {
  (id: string): MaybeTranslated;
  (id: string, options: Options): MaybeTranslated;
}

/**
 * Utility which will turn a union of middleware options into an intersection
 * of middleware options.
 */
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

/**
 * Combines a set of translator middlewares into a single middleware.
 * This can be used to group common used middleware into a template. Other middlewares
 * can be placed before and after, but keep in mind that the general middleware rules still apply.
 * See `createTranslator` for more.
 *
 * @see createTranslator
 * @param middlewares Middlewares to combine.
 */
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
