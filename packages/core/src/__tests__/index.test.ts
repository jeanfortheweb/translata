import { createTranslator, combineMiddlewares } from '..';
import {
  withTranslations,
  withDefaultLocale,
  withPlaceholders,
} from '../middlewares';

describe('createTranslator', () => {
  it('should compose a translator function from middlewares', () => {
    const translate = jest.fn();
    const middleware = jest.fn(() => translate);
    const translator = createTranslator(middleware);
    const translated = translator('translation.id', { option: true });

    expect(middleware).toHaveBeenCalled();
    expect(translate).toHaveBeenCalledWith('translation.id', { option: true });
    expect(translated).not.toBeDefined();
  });

  it('should return undefined when no middleware returned a translation', () => {
    const middleware = jest.fn(next => () => next());
    const translator = createTranslator(middleware);
    const translated = translator('translation.id');

    expect(middleware).toHaveBeenCalled();
    expect(translated).not.toBeDefined();
  });
});

describe('combineMiddlewares', () => {
  it('should call combined middleswares as expected', () => {
    const combined = combineMiddlewares(
      withTranslations('en', {
        'global.greeting': 'Hello {{name}}!',
      }),
      withDefaultLocale('en'),
    );

    const translator = createTranslator(
      withTranslations('en', {
        'global.goodbye': 'Goodbye, {{name}}!',
      }),
      combined,
      withPlaceholders(),
    );

    const greeting = translator('global.greeting', {
      values: {
        name: 'John Doe',
      },
    });

    const goodbye = translator('global.goodbye', {
      values: {
        name: 'John Doe',
      },
    });

    expect(greeting).toEqual('Hello John Doe!');
    expect(goodbye).toEqual('Goodbye, John Doe!');
  });
});
