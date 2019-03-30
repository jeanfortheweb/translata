import { withTranslationFile, withTranslationDirectory } from '../filesystem';
import { resolve } from 'path';

describe('withTranslationFile', () => {
  it.each`
    path                                         | type
    ${resolve(__dirname, 'fixtures', 'en.json')} | ${'json'}
    ${resolve(__dirname, 'fixtures', 'en.yml')}  | ${'yml'}
    ${resolve(__dirname, 'fixtures', 'en.yaml')} | ${'yaml'}
  `('should load translation data from $type files', ({ path }) => {
    const next = jest.fn();
    const middleware = withTranslationFile('en', path);

    const hello = middleware(next)('global.hello', { locale: 'en' });
    const goodbye = middleware(next)('global.goodbye', { locale: 'en' });
    const missing = middleware(next)('global.missing', { locale: 'en' });

    expect(next).toHaveBeenCalledTimes(1);
    expect(hello).toEqual('Hello User!');
    expect(goodbye).toEqual('Goodbye User!');
    expect(missing).not.toBeDefined();
  });

  it('should throw on unsupported file types', () => {
    expect(() => withTranslationFile('en', 'file.txt')).toThrow(
      'File type for file.txt is not supported.',
    );
  });
});

describe('withTranslationDirectory', () => {
  const next = jest.fn();
  const path = resolve(__dirname, 'fixtures', 'translations');

  it('should load translations from a directory', () => {
    const middleware = withTranslationDirectory(path);
    const translate = middleware(next);

    expect(next).not.toHaveBeenCalled();
    expect(translate('global.hello', { locale: 'en' })).toEqual('Hello User!');
    expect(translate('global.hello', { locale: 'de' })).toEqual(
      'Hallo Benutzer!',
    );
  });

  it('should load translations from a directory using a custom pattern', () => {
    const options = { pattern: '{{namespace}}/{{locale}}.(json|yml)' };
    const middleware = withTranslationDirectory(path, options);
    const translate = middleware(next);

    expect(next).not.toHaveBeenCalled();
    expect(translate('global.hello', { locale: 'en' })).toEqual('Hello User!');
    expect(translate('global.hello', { locale: 'de' })).toEqual(
      'Hallo Benutzer!',
    );
  });

  it('should load translations from a directory without namespacing', () => {
    const options = { pattern: '^{{locale}}.json$' };
    const path = resolve(__dirname, 'fixtures');
    const middleware = withTranslationDirectory(path, options);
    const translate = middleware(next);

    expect(next).not.toHaveBeenCalled();
    expect(translate('global.hello', { locale: 'en' })).toEqual('Hello User!');
    expect(translate('global.hello', { locale: 'de' })).toEqual(
      'Hallo Benutzer!',
    );
  });
});
