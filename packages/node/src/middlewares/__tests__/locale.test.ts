import { withSystemLocale } from '../locale';

describe('withSystemLocale', () => {
  it('should detect the system locale', () => {
    const { LC_ALL, LC_MESSAGES, LANG, LANGUAGE } = process.env;
    const locale = (LC_ALL || LC_MESSAGES || LANG || LANGUAGE || '')
      .split('_')
      .shift();

    const next = jest.fn();
    const middleware = withSystemLocale();

    middleware(next)('translation.id', {});

    expect(next).toHaveBeenCalledWith('translation.id', { locale });
  });
});
