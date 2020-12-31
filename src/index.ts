import path from 'path';
import {
  createLambda,
  rename,
  download,
  shouldServe,
  BuildOptions,
  glob,
  PrepareCacheOptions,
  FileFsRef
} from '@vercel/build-utils';
import { getBrefFiles, runComposerInstall } from './utils';

const COMPOSER_FILE = process.env.COMPOSER || 'composer.json';

// ###########################
// EXPORTS
// ###########################

export const version = 3;

export async function build({
  files,
  entrypoint,
  workPath,
  config = {},
  meta = {},
}: BuildOptions) {
  // Check if now dev mode is used
  if (meta.isDev) {
    console.log(`
      🐘 vercel dev is not supported right now.
      Please use PHP built-in development server.

      php -S localhost:8000 api/index.php
    `);
    process.exit(255);
  }

  console.log('🐘 Downloading user files');

  // Collect user provided files
  const userFiles: RuntimeFiles = await download(files, workPath, meta);

  console.log('🐘 Downloading PHP runtime files');

  // Collect runtime files containing PHP bins and libs
  const runtimeFiles: RuntimeFiles = {
    // Append brefphp files (bins + shared object)
    ...await getBrefFiles(),
  };

  // If composer.json is provided try to
  // - install deps
  // - run composer scripts
  if (userFiles[COMPOSER_FILE]) {
    // Install dependencies (vendor is collected bellow, see harvestedFiles)
    await runComposerInstall(workPath);

    // Run composer scripts (created files are collected bellow, , see harvestedFiles)
    // await runComposerScripts(userFiles[COMPOSER_FILE], workPath);
  }

  // Collect user files, files creating during build (composer vendor)
  // and other files and prefix them with "user" (/var/task/user folder).
  const harverstedFiles = rename(
    await glob('**', {
      cwd: workPath,
      ignore:
        config && config.excludeFiles
          ? Array.isArray(config.excludeFiles) ? config.excludeFiles : [config.excludeFiles]
          : ['node_modules/**', 'now.json', '.nowignore', 'vercel.json', '.vercelignore'],
    }),
    name => path.join('user', name)
  );

  // Show some debug notes during build
  if (process.env.VERCEL_BREF_DEBUG === '1') {
    console.log('🐘 Entrypoint:', entrypoint);
    console.log('🐘 Config:', config);
    console.log('🐘 Work path:', workPath);
    console.log('🐘 Meta:', meta);
    console.log('🐘 User files:', Object.keys(harverstedFiles));
    console.log('🐘 Runtime files:', Object.keys(runtimeFiles));
  }

  console.log('🐘 Creating lambda');

  const lambda = await createLambda({
    files: {
      // Located at /var/task/user
      ...harverstedFiles,
      // Located at /var/task/native (brefphp)
      ...runtimeFiles,
      // User our tuned bootstrap (wrapper around brefphp's bootstrap)
      ...{
        'bootstrap': new FileFsRef({
          mode: 0o755,
          fsPath: path.join(__dirname, '../lib/bootstrap'),
        }),
      }
    },
    handler: entrypoint,
    runtime: 'provided',
    environment: {
      PHP_INI_SCAN_DIR: '/var/task/native/bref/etc/php/conf.d'
    },
  });

  return { output: lambda };
};

export async function prepareCache({ workPath }: PrepareCacheOptions): Promise<RuntimeFiles> {
  return {
    // Composer
    ...(await glob('vendor/**', workPath)),
    ...(await glob('composer.lock', workPath)),
    // NPM
    ...(await glob('node_modules/**', workPath)),
    ...(await glob('package-lock.json', workPath)),
    ...(await glob('yarn.lock', workPath)),
  };
}

export { shouldServe };
