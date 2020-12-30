const index = require('./../../dist/index');

test('lookup php files', async () => {
    const files = await index.getBrefFiles();

    expect(Object.keys(files).length).toEqual(140);
    expect(typeof files).toEqual('object');
});

test('have all php files', async () => {
    const files = await index.getBrefFiles();
    expect(files).toHaveProperty('native/bootstrap');
    expect(files).toHaveProperty('native/bin/composer');
    expect(files).toHaveProperty('native/bin/pecl');
    expect(files).toHaveProperty('native/bin/php');
    expect(files).toHaveProperty('native/bin/php-fpm');
});
