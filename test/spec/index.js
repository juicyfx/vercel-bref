const utils = require('./../../dist/utils');

test('lookup php files', async () => {
    const files = await utils.getBrefFiles();

    expect(Object.keys(files).length).toEqual(82);
    expect(typeof files).toEqual('object');
});

test('have all php files', async () => {
    const files = await utils.getBrefFiles();
    expect(files).toHaveProperty('native/bootstrap');
    expect(files).toHaveProperty('native/bin/composer');
    expect(files).toHaveProperty('native/bin/php');
    expect(files).toHaveProperty('native/bin/php-fpm');
});
