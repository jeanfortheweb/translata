import React, { ReactElement, useEffect } from 'react';
import { createTranslatorProvider } from '..';
import { render, act, getByTestId } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {
  createTranslator,
  withTranslations,
  withDefaultLocale,
} from '@translata/core';

const Translator = createTranslatorProvider('en', locale =>
  createTranslator(
    withTranslations('en', {
      greeting: 'Hello User',
    }),
    withTranslations('de', {
      greeting: 'Hallo Benutzer',
    }),
    withDefaultLocale(locale),
  ),
);

const Root = ({ children }: { children: ReactElement }) => {
  return <Translator>{children}</Translator>;
};

it('should setup a working provider', async () => {
  const Component = () => {
    const _ = Translator.useTranslator();

    return <div data-testid="div">{_('greeting')}</div>;
  };

  act(() => {
    render(
      <Root>
        <Component />
      </Root>,
    );
  });

  const element = getByTestId(document.body, 'div');

  expect(element).toMatchSnapshot('english');
});

it('should change the locale', async () => {
  const Component = () => {
    const _ = Translator.useTranslator();
    const setLocale = Translator.useSetLocale();

    useEffect(() => setLocale('de'), []);

    return <div data-testid="div">{_('greeting')}</div>;
  };

  act(() => {
    render(
      <Root>
        <Component />
      </Root>,
    );
  });

  const element = getByTestId(document.body, 'div');

  expect(element).toMatchSnapshot('german');
});

it('should change provide the current locale', async () => {
  const Component = () => {
    const locale = Translator.useLocale();

    return <div data-testid="div">{locale}</div>;
  };

  act(() => {
    render(
      <Root>
        <Component />
      </Root>,
    );
  });

  const element = getByTestId(document.body, 'div');

  expect(element).toMatchSnapshot('locale');
});
