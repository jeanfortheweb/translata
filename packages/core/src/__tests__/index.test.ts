import { createTranslator } from '..';

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
