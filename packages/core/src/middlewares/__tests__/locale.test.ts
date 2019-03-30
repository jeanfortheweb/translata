import { withDefaultLocale, withFallbackLocale } from '../locale';

describe('withDefaultLocale', () => {
  it('should set a default locale', () => {
    const next = jest.fn();
    const middleware = withDefaultLocale('en');
    const translated = middleware(next)('translation.id', {});

    expect(next).toHaveBeenCalledWith('translation.id', { locale: 'en' });
    expect(translated).not.toBeDefined();
  });
});

describe('withFallbackLocale', () => {
  it('should override the locale when translared is undefined', () => {
    const next = jest.fn();
    const middleware = withFallbackLocale('de');
    const translated = middleware(next)('translation.id', { locale: 'en' });

    expect(next).toHaveBeenCalledWith('translation.id', { locale: 'de' });
    expect(translated).not.toBeDefined();
  });

  it('should prefer the fallback from options', () => {
    const next = jest.fn();
    const middleware = withFallbackLocale('de');
    const translated = middleware(next)('translation.id', {
      locale: 'en',
      fallback: 'fr',
    });

    expect(next).toHaveBeenCalledWith('translation.id', { locale: 'fr' });
    expect(translated).not.toBeDefined();
  });

  it('should not fallback if previous translation was successful', () => {
    const next = jest.fn(() => 'Foobar');
    const middleware = withFallbackLocale('de');
    const translated = middleware(next)('translation.id', {
      locale: 'en',
    });

    expect(next).toHaveBeenCalledWith('translation.id', { locale: 'en' });
    expect(translated).toEqual('Foobar');
  });
});
