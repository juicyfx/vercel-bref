const {glob} = require("@vercel/build-utils");
const path = require("path");

const BREF_PKG = path.dirname(require.resolve('vercel-bref/package.json'));

test('lookup php files', async () => {
  const files = await glob('native/**', {cwd: BREF_PKG});

  expect(Object.keys(files).length).toEqual(81);
  expect(typeof files).toEqual('object');
});

test('have all php files', async () => {
  const files = await glob('native/**', {cwd: BREF_PKG});

  expect(files).toHaveProperty('native/brefphp');
  expect(files).toHaveProperty('native/bin/composer');
  expect(files).toHaveProperty('native/bin/php');
  expect(files).toHaveProperty('native/bin/php-fpm');
});
