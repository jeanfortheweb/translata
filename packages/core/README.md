# @translata/core

Provides the core functionality for Translata. This includes the actual factory function `createTranslator`
as basic middlewares for locales, translations and placeholder patterns.

## Installation

```sh
yarn add @translata/core
```

## Documentation

### `createTranslator(...middlewares: Middleware[])`

Create a translator function from middlewares. The order of middlewares matters.
As a rule of thumb you should order them:

1. Translation string providers (everything that provides translation strings)
2. Locale manipulators (everything that changes or sets the locale)
3. Translation string manipulators (everything that works on the resolved translation string)

```ts
import { createTranslator } from '@translata/core';

const _ = createTranslator(
  withTranslations('en', {
    'user.greeting': 'Welcome to Translata!',
  }),
);

_('user.greeting', { locale: 'en' }); // Welcome to Translata!
```

### `withDefaultLocale(locale: string)`

Sets a default locale when no other is given.

```ts
import { createTranslator, withDefaultLocale } from '@translata/core';

const _ = createTranslator(withDefaultLocale('en'));

_('translation_id'); // { locale: 'en' } will be present in options.
_('translation_id', { locale: 'fr' }); // { locale: 'fr' } will be present in options.
```

### `withFallbackLocale(locale: string)`

Overrides the current locale present when the translation resulted in `undefined`.

```ts
import { createTranslator, withDefaultLocale } from '@translata/core';

const _ = createTranslator(
  withTranslations('en', {
    'user.greeting': 'Welcome to Translata!',
  }),
  withFallbackLocale('en'),
);

_('user.greeting', { locale: 'fr' }); // { locale: 'en' } will be used and result in "Welcome to Translata!"
_('user.greeting', { locale: 'fr', fallback: 'en' }); // Fallback can also be set in options and has priority.
```

### `withTranslations(locale: string, translations: { [key: string]: string})`

Injects translation strings.
It takes the target locale and a map of translation strings, where the key is the translation id.

It is recommended to use "scoped" translation ids. That means, you should prefix translation ids with
a namespace, to prevent conflicts of different translation sources.

The first middleware that provides a certain translation id will win and return it.

```ts
import { createTranslator, withTranslations } from '@translata/core';

const _ = createTranslator(
  withTranslations('en', {
    'user.greeting': 'Welcome to Translata!',
  }),
  withTranslations('de', {
    'user.greeting': 'Willkommen bei Translata!',
  }),
);

_('user.greeting', { locale: 'en' }); // Welcome to Translata!
_('user.greeting', { locale: 'de' }); // Willkommen bei Translata!
_('user.greeting', { locale: 'fr' }); // undefined
```

### `withPlaceholders(values?: { [key: string]: any })`

Gives translation strings the ability to contain placeholders.
This middleware should always come after middlewares that find translation strings or manipulate locales.

```ts
import {
  createTranslator,
  withTranslations,
  withDefaultLocale,
  withPlaceholders,
} from '@translata/core';

const _ = createTranslator(
  withTranslations('en', {
    'user.greeting': 'Welcome to Translata, {{name}}!',
  }),
  withDefaultLocale('en')
  withPlaceholders(),
);

_('user.greeting', { values: { name: 'John' } }); // Welcome to Translata, John!
```

Values can also be passed to the middleware function which then provide default values. Values passed to the translator function
have priority:

```ts
import {
  createTranslator,
  withTranslations,
  withDefaultLocale,
  withPlaceholders,
} from '@translata/core';

const _ = createTranslator(
  withTranslations('en', {
    'debug.env': 'Current env is {{env}}',
  }),
  withDefaultLocale('en')
  withPlaceholders({
      env: 'development'
  }),
);

_('debug.env'); // Current env is development
_('debug.env', { values: { env: 'production' } }); // Current env is production
```

Values can also be functions which will be invoked when translation occours:

```ts
import {
  createTranslator,
  withTranslations,
  withDefaultLocale,
  withPlaceholders,
} from '@translata/core';

const _ = createTranslator(
  withTranslations('en', {
    'date.now': 'Current date is {{date}}',
  }),
  withDefaultLocale('en')
  withPlaceholders({
      date: () => new Date().toDateString()
  }),
);

_('date.now'); // Current date is Sat Mar 30 2019
```

### `withLogger(logger?: (id: string, options: LocaleOptions) => void)`

Will log missing translations with `console.warn`.

```ts
import { createTranslator, withLogger } from '@translata/core';

const _ = createTranslator(withLogger());

_('global.greeting', { locale: 'en' }); // Will log: Missing translation for "global.greeting" on locale "en"
```

If a logger function is passed, it is called instead.

```ts
import { createTranslator, withLogger } from '@translata/core';

const _ = createTranslator(
  withLogger((id, options) =>
    console.error(`No translation for ${id} (locale = ${options.locale})!`),
  ),
);

_('global.greeting', { locale: 'en' }); // Will log: No translation for global.greeting (locale = en)!
```

### `withFallbackTranslation(translate: (id: string, options: LocaleOptions) => string)`

When a translation is missing, the given translate callback is used to determine a fallback translation string.

```ts
import { createTranslator, withFallbackTranslation } from '@translata/core';

const _ = createTranslator(
  withFallbackTranslation(
    (id, options) =>
      `PLEASE IMPLEMENT ME ON LOCALE "${options.locale}": ${id} `,
  ),
);

_('global.greeting', { locale: 'en' }); // PLEASE IMPLEMENT ME ON LOCALE "en": global.greeting
```
