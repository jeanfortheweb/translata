import { withPlaceholders } from '../placeholders';

describe('withPlaceholders', () => {
  it('should replace values in translation strings', () => {
    const next = jest.fn(() => "I'm sorry Ms. {{name}}");
    const middleware = withPlaceholders({
      name: 'Jackson',
    });

    const translated = middleware(next)('translation.id', { locale: 'en' });

    expect(next).toHaveBeenCalledWith('translation.id', { locale: 'en' });
    expect(translated).toEqual("I'm sorry Ms. Jackson");
  });

  it('should support functions as replacement values', () => {
    const next = jest.fn(() => "I'm sorry Ms. {{name}}");
    const middleware = withPlaceholders({
      name: () => 'Jackson',
    });

    const translated = middleware(next)('translation.id', { locale: 'en' });

    expect(next).toHaveBeenCalledWith('translation.id', { locale: 'en' });
    expect(translated).toEqual("I'm sorry Ms. Jackson");
  });

  it('should prefer values from options', () => {
    const next = jest.fn(() => "I'm sorry Ms. {{name}}");
    const middleware = withPlaceholders({
      name: () => 'Jackson',
    });

    const translated = middleware(next)('translation.id', {
      locale: 'en',
      values: { name: 'Wilson' },
    });

    expect(next).toHaveBeenCalledWith('translation.id', {
      locale: 'en',
      values: { name: 'Wilson' },
    });

    expect(translated).toEqual("I'm sorry Ms. Wilson");
  });

  it('should do nothing if translated is undefined', () => {
    const next = jest.fn();
    const middleware = withPlaceholders();

    const translated = middleware(next)('translation.id', {
      locale: 'en',
    });

    expect(translated).not.toBeDefined();
    expect(next).toHaveBeenCalledWith('translation.id', {
      locale: 'en',
    });
  });
});
