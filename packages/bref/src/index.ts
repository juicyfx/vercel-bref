const {
  download,
  createLambda,
  shouldServe,
  rename,
} = require('@now/build-utils');
const FileFsRef = require('@now/build-utils/file-fs-ref.js');
const path = require('path');
const { getFiles } = require('@juicyfx/php-bref-lib-73');

// ###########################
// EXPORTS
// ###########################

exports.config = {
  maxLambdaSize: '45mb',
};

exports.analyze = ({ files, entrypoint }) => files[entrypoint].digest;

exports.shouldServe = shouldServe;

exports.build = async ({
  files, entrypoint, workPath, config, meta,
}) => {
  const downloadedFiles = await download(files, workPath, meta);
  const userFiles = rename(downloadedFiles, name => path.join('user', name));

  const bridgeFiles = {
    ...await getFiles(),
    ...{
      'bootstrap': new FileFsRef({
        mode: 0o755,
        fsPath: path.join(__dirname, 'bootstrap'),
      }),
    }
  };

  console.log('Entrypoint:', entrypoint);
  console.log('Config:', config);
  console.log('Work path:', workPath);
  console.log('Meta:', meta);
  console.log('User files:', Object.keys(userFiles));
  console.log('Bridge files:', Object.keys(bridgeFiles));

  const lambda = await createLambda({
    files: { ...userFiles, ...bridgeFiles },
    handler: entrypoint,
    runtime: 'provided',
  });

  return { [entrypoint]: lambda };
};
