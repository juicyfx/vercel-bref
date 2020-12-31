import { glob, spawnAsync } from "@vercel/build-utils";
import { SpawnOptions, spawnSync } from 'child_process';
import path from "path";

const BREF_PKG = path.dirname(require.resolve('vercel-bref/package.json'));
const NATIVE_ZIP = path.join(BREF_PKG, 'native.zip');
const PHP_BIN_DIR = path.join(BREF_PKG, "native/bref/bin");
const PHP_MODULES_DIR = path.join(BREF_PKG, "native/bref/lib/php/extensions/no-debug-non-zts-20200930");
const PHP_LIB_DIR = path.join(BREF_PKG, "native/bref/lib");
const PHP_LIB64_DIR = path.join(BREF_PKG, "native/bref/lib64");
const COMPOSER_BIN = path.join(BREF_PKG, "native/bin/composer");

export async function getBrefFiles(): Promise<RuntimeFiles> {
  // Unzip brefphp files
  await spawnSync('unzip', [NATIVE_ZIP], { cwd: BREF_PKG })

  // Lookup for all files in native folder
  return await glob('native/**', { cwd: BREF_PKG });
}

export async function runComposerInstall(workPath: string): Promise<void> {
  console.log('🐘 Installing Composer dependencies [START]');

  await runPhp(
    [
      COMPOSER_BIN,
      'install',
      '--profile',
      '--no-dev',
      '--no-interaction',
      '--no-scripts',
      '--ignore-platform-reqs',
      '--no-progress'
    ],
    {
      stdio: 'inherit',
      cwd: workPath
    }
  );

  console.log('🐘 Installing Composer dependencies [DONE]');
}

async function runPhp(args: string[], opts: SpawnOptions = {}) {
  try {
    const options = {
      ...opts,
      env: {
        ...process.env,
        ...(opts.env || {}),
        COMPOSER_HOME: '/tmp',
        PATH: `${PHP_BIN_DIR}:${process.env.PATH}`,
        PHP_INI_EXTENSION_DIR: PHP_MODULES_DIR,
        PHP_INI_SCAN_DIR: `:${path.resolve(__dirname, '../conf')}`,
        LD_LIBRARY_PATH: `${PHP_LIB_DIR}:${PHP_LIB64_DIR}:/usr/lib64:/lib64:${process.env.LD_LIBRARY_PATH}`
      }
    };

    await spawnAsync(
      'php',
      args,
      options
    );
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
