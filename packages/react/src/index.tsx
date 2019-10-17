import { Translator } from '@translata/core';
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactElement,
} from 'react';

/**
 * Create a translator provider, including hooks to consume the translation context.
 *
 * @param defaultLocale Default locale.
 * @param factory Translator factory.
 */
export function createTranslatorProvider<
  TranslatorType extends Translator<any>
>(defaultLocale: string, factory: (locale: string) => TranslatorType) {
  const Context = createContext({
    translator: (null as any) as TranslatorType,
    locale: (null as any) as string,
    setLocale: (null as any) as (locale: string) => void,
  });

  /**
   * The Translator Provider.
   *
   * @param props
   */
  function Provider(props: { children: ReactElement }) {
    const [locale, setLocale] = useState(defaultLocale);
    const translator = useMemo(() => factory(locale), [locale]);
    const state = useMemo(
      () => ({
        translator,
        locale,
        setLocale,
      }),
      [translator, locale],
    );

    return <Context.Provider value={state}>{props.children}</Context.Provider>;
  }

  /**
   * Use the current translator from context.
   */
  function useTranslator(): TranslatorType {
    return useContext(Context).translator;
  }

  /**
   * Use the current locale from context.
   */
  function useLocale(): string {
    return useContext(Context).locale;
  }

  /**
   * Use the locale setter from context, this allows you to change
   * the default locale on context level.
   */
  function useSetLocale(): (value: string) => void {
    return useContext(Context).setLocale;
  }

  return Object.assign(Provider, { useLocale, useSetLocale, useTranslator });
}
