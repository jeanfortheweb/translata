import { withTranslations } from '../translations';

describe('withTranslations', () => {
  it('should return a translation string', () => {
    const next = jest.fn();
    const middleware = withTranslations('en', {
      'translation.id': 'Foobar',
    });

    const translated = middleware(next)('translation.id', { locale: 'en' });

    expect(next).not.toHaveBeenCalled();
    expect(translated).toEqual('Foobar');
  });

  it('should delegate to the next withTranslation when no string was found', () => {
    const next = jest.fn();
    const middleware1 = withTranslations('en', {});
    const middleware2 = withTranslations('en', {
      'translation.id': 'Foobar',
    });

    const translated = middleware1(middleware2(next))('translation.id', {
      locale: 'en',
    });

    expect(next).not.toHaveBeenCalled();
    expect(translated).toEqual('Foobar');
  });

  it('should return undefined when no translation was found', () => {
    const next = jest.fn();
    const middleware = withTranslations('en', {});
    const translated = middleware(next)('translation.id', {
      locale: 'en',
    });

    expect(next).toHaveBeenCalledWith('translation.id', { locale: 'en' });
    expect(translated).not.toBeDefined();
  });
});
