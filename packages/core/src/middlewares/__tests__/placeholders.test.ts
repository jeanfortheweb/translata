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
      values: {
        name: 'Wilson',
      },
    });

    expect(next).toHaveBeenCalledWith('translation.id', {
      locale: 'en',
      values: { name: 'Wilson' },
    });

    expect(translated).toEqual("I'm sorry Ms. Wilson");
  });

  it('should pass values to value callback', () => {
    interface Context {
      name: string;
    }

    const next = jest.fn(() => 'The sentence is: {{sentence}}');
    const middleware = withPlaceholders({
      sentence: (values: Context) =>
        values.name === 'Jackson' ? "I'm sorry Ms. Jackson" : 'Oh Mrs. Wilson!',
    });

    let translated;

    translated = middleware(next)('translation.id', {
      locale: 'en',
      context: {
        name: 'Jackson',
      },
    });

    expect(next).toHaveBeenCalledWith('translation.id', {
      locale: 'en',
      context: {
        name: 'Jackson',
      },
    });

    expect(translated).toEqual("The sentence is: I'm sorry Ms. Jackson");

    translated = middleware(next)('translation.id', {
      locale: 'en',
      context: {
        name: 'Wilson',
      },
    });

    expect(next).toHaveBeenCalledWith('translation.id', {
      locale: 'en',
      context: {
        name: 'Wilson',
      },
    });

    expect(translated).toEqual('The sentence is: Oh Mrs. Wilson!');
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
