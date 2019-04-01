# @translata/node <!-- omit in toc -->

Provides middlewares focused on node usage.

## Installation <!-- omit in toc -->

```sh
yarn add @translata/core @translata/node
```

## Documentation <!-- omit in toc -->

- [withTranslationFile](#withtranslationfile)
- [withTranslationDirectory](#withtranslationdirectory)
- [withSystemLocale](#withsystemlocale)

### withTranslationFile

Reads translations from the given file and stores them for the given locale.
Currently json and yaml files are supported.

```json
// en.json
{
  "global.hello": "Hello User!",
  "global.bye": "Bye User!"
}
```

```yaml
// de.yaml
global.hello: Hallo Benutzer!
global.bye: Tschüss Benutzer!
```

```ts
import { createTranslator } from '@translata/core';
import { withTranslationFile } from '@translata/node';

const _ = createTranslator(
  withTranslationFile('en', resolve(__dirname, 'en.json')),
  withTranslationFile('de', resolve(__dirname, 'de.yaml')),
);

_('global.hello', { locale: 'en' }); // Hello User!
_('global.bye', { locale: 'de' }); // Tschüss Benutzer!
```

### withTranslationDirectory

Loads translation files from a directory, detecting namespacing and locales.
By default, the middleware will check for files in the given directory that matches the pattern `{{namespace}}.{{locale}}.(json|yaml|yml)`. So, a valid file name would be like `global.en.json`.

Lets imagine we have a structure like:

    i18n/
      global.en.json
      global.de.json
      labels.de.json
      labels.en.json

Then we could setup the middleware like:

```ts
import { createTranslator } from '@translata/core';
import { withTranslationDirectory } from '@translata/node';

const _ = createTranslator(
  withTranslationDirectory(resolve(__dirname, 'i18n')),
);

_('global.hello', { locale: 'en' }); // Hello User!
_('global.bye', { locale: 'de' }); // Tschüss Benutzer!
_('labels.cancel', { locale: 'de' }); // Abbrechen
```

Notice that the namespace, which is part of the filename, is automatically applied as prefix to our translation ids.
If you don't want that, you can pass a custom pattern without a namespace. In this case, translation ids are taken as they
are, without modification:

```ts
import { createTranslator } from '@translata/core';
import { withTranslationDirectory } from '@translata/node';

const _ = createTranslator(
  withTranslationDirectory(resolve(__dirname, 'i18n'), {
    pattern: '{{locale}}.json',
  }), // finds files like i18n/de.json
);
```

You could also pass a pattern which will allow you to place each namespace in its own folder, like so:

```ts
import { createTranslator } from '@translata/core';
import { withTranslationDirectory } from '@translata/node';

const _ = createTranslator(
  withTranslationDirectory(resolve(__dirname, 'i18n'), {
    pattern: '{{namespace}}/{{locale}}.json',
  }), // finds files like i18n/global/de.json
);
```

### withSystemLocale

Detects the system locale and sets it as value option for the following middlewares.

```ts
import { createTranslator } from '@translata/core';
import { withSystemLocale } from '@translata/node';

const _ = createTranslator(
  withTranslationDirectory(resolve(__dirname, 'i18n')),
  withSystemLocale(),
);

_('global.hello'); // Locale of the current system is passed, like { locale: 'en' }
```

Combine it with `withFallbackLocale` to have a fallback ready:

```ts
import { createTranslator, withFallbackLocale } from '@translata/core';
import { withSystemLocale } from '@translata/node';

const _ = createTranslator(
  withTranslationDirectory(resolve(__dirname, 'i18n')),
  withFallbackLocale('en')
  withSystemLocale()
);

_('global.hello'); // Locale of the current system is passed, like { locale: 'fr' } with fallback to { locale: 'en' }
```
