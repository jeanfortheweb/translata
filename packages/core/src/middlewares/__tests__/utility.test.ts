import { withLogger, withFallbackTranslation } from '..';

describe('withLogger', () => {
  it('should log missing translation strings', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();
    const next = jest.fn();
    const middleware = withLogger();
    const translated = middleware(next)('translation.id', { locale: 'en' });

    expect(translated).not.toBeDefined();
    expect(next).toHaveBeenCalledWith('translation.id', { locale: 'en' });
    expect(spy).toHaveBeenCalledWith(
      'Missing translation for "translation.id" on locale "en"',
    );
  });

  it('should log missing translation strings with a custom log function', () => {
    const logger = jest.fn();
    const next = jest.fn();
    const middleware = withLogger(logger);
    const translated = middleware(next)('translation.id', { locale: 'en' });

    expect(logger).toHaveBeenCalledWith('translation.id', { locale: 'en' });
    expect(next).toHaveBeenCalledWith('translation.id', { locale: 'en' });
    expect(translated).not.toBeDefined();
  });
});

describe('withFallbackTranslation', () => {
  it('should return a fallback translation', () => {
    const fallback = jest.fn((id: string) => `No translation for ${id}`);
    const next = jest.fn();
    const middleware = withFallbackTranslation(fallback);
    const translated = middleware(next)('translation.id', { locale: 'en' });

    expect(fallback).toHaveBeenCalledWith('translation.id', { locale: 'en' });
    expect(next).toHaveBeenCalledWith('translation.id', { locale: 'en' });
    expect(translated).toEqual('No translation for translation.id');
  });

  it('should return original translation when exist', () => {
    const translate = jest.fn();
    const next = jest.fn(() => 'Translated!');
    const middleware = withFallbackTranslation(translate);
    const translated = middleware(next)('translation.id', { locale: 'en' });

    expect(translate).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith('translation.id', { locale: 'en' });
    expect(translated).toEqual('Translated!');
  });
});
