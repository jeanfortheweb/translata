[![Build Status](https://travis-ci.org/jeanfortheweb/translata.svg?branch=master)](https://travis-ci.org/jeanfortheweb/translata) [![Maintainability](https://api.codeclimate.com/v1/badges/29e376d945395da69418/maintainability)](https://codeclimate.com/github/jeanfortheweb/translata/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/947ddbd81606293ef9a8/test_coverage)](https://codeclimate.com/github/jeanfortheweb/translata/test_coverage)

# Translata - The Composable Translation Utility

**Translata** was created when I struggled with the current i18n utilities avaible. They seem outdated, had features I don't need, or where unusable (in a smooth way) in modular environments. So I decided to create a utility based on functional principles with some simple goals:

- **Modular** - Decide which features you need and in which environment.
- **Independend** - No global scope, no mutations, no singletons. Create as many translators as you like.
- **Easy** - It should be possible to mix and match a setup with minimal effort.

**Translata** is completely written in TypeScript and supports advanced typings.

## Installation

For the most simple use cases, you just have to install the core package. It will give you the `createTranslator` function plus
all those middlewares you need to get started:

```sh
yarn add @translata/core
```

## Usage

A translator is created by using the `createTranslator` function. It takes a variable number of middlewares to create the translation function you want.

In the most simple case, you just need to define a default locale and a set of translation strings:

```ts
// translator.ts

import {
  createTranslator,
  withDefaultLocale,
  withTranslations,
} from '@translata/core';

export default createTranslator(
  withTranslations('en', {
    'user.greeting': 'Welcome to Translata!',
  }),
  withTranslations('de', {
    'user.greeting': 'Willkommen bei Translata!',
  }),
  withDefaultLocale('en'),
);
```

Now you can use it in your project somewhere else:

```ts
import _ from './translator';

_('user.greeting'); // Welcome to Translata!
_('user.greeting', { locale: 'de' }); // Willkommen bei Translata!
```

## Documentation

For a full documentation, just checkout the `README.md` files for each package, since they will go into detail for each scope:

- [@translata/core](./packages/core/README.md)
- [@translata/node](./packages/node/README.md)
