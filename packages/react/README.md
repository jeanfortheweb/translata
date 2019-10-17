# @translata/react <!-- omit in toc -->

Provides a react integration for **Translata**.

## Installation <!-- omit in toc -->

```sh
yarn add @translata/core @translata/react
```

## Documentation <!-- omit in toc -->

- [createTranslatorProvider](#createtranslatorprovider)

### createTranslatorProvider

Create a translator provider using a default locale and a factory function.
The factory function gets the current active locale and should return a setup translator function which is created by [createTranslator](../core/README.md#createtranslator):

```ts
// AppTranslator.ts
import { createTranslator, withTranslations, withDefaultLocale } from '@translata/core';
import { createTranslatorProvider } from '@translata/react';

export default createTranslatorProvider('en', locale => createTranslator(
  withTranslations('en', {
    'message.greeting': 'Hello!',
    'button.de': 'Goto german',
    'button.en': 'Goto english'
  }),
  withTranslations('en', {
    'message.greeting': 'Hallo!',
    'button.de': 'Wechsel zu Deutsch',
    'button.en': 'Wechsel zu Englisch'
  })
  withDefaultLocale(locale)
));
```

Wrap this Provider around your application:

```tsx
// App.tsx
import AppTranslator from './AppTranslator';
import Component from './Component';

export default () => {
  return (
    <AppTranslator>
      <Component />
    </AppTranslator>
  );
}
```

Use the translator context inside your components:

```tsx
// Component.tsx
import AppTranslator from './AppTranslator';

export default () => {
  // get the actual translator function.
  const _ = AppTranslator.useTranslator();

  // get the current active locale.
  const locale = AppTranslator.useLocale();

  // get a locale setter to change the locale on the context.
  // this will reinvoke your translator factory function passed to createTranslatorProvider().
  const setLocale = AppTranslator.useSetLocale();

  // callback to change locale to "de"
  const setLocaleToDe = useCallback(() => {
    setLocale('de');
  }, [])

  // callback to change locale to "en"
  const setLocaleToEn = useCallback(() => {
    setLocale('en');
  }, [])

  // use the translata as you would without react.
  return (
    <div>
      {_('message.greeting')}
      <button disabled={locale === 'de'} onClick={setLocaleToDe}>{_('button.de')}</button>
      <button disabled={locale === 'en'} onClick={setLocaleToDe}>{_('button.en')}</button>
    </div>
  );
}
```
