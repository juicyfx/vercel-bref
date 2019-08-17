import { BuildOptions, download, glob } from "@now/build-utils/dist";
import { spawn } from 'child_process';
import path from "path";

const PHP_PKG = path.dirname(require.resolve('@now-bref/lib/package.json'));
const PHP_BIN_DIR = path.join(PHP_PKG, "native/bref/bin");
const PHP_MODULES_DIR = path.join(PHP_BIN_DIR, "native/bref/lib/php/extensions/no-debug-zts-20180731");
const PHP_LIB_DIR = path.join(PHP_PKG, "native/bref/lib");
const PHP_LIB64_DIR = path.join(PHP_PKG, "native/bref/lib64");
const COMPOSER_BIN = path.join(PHP_PKG, "native/bin/composer");

export async function getIncludedFiles({ files, entrypoint, workPath, config, meta }: BuildOptions): Promise<Files> {
  // Download all files to workPath
  const downloadedFiles = await download(files, workPath, meta);

  let includedFiles = {};
  if (config && config.includeFiles) {
    // Find files for each glob
    for (const pattern of config.includeFiles) {
      const matchedFiles = await glob(pattern, workPath);
      Object.assign(includedFiles, matchedFiles);
    }
    // explicit and always include the entrypoint
    Object.assign(includedFiles, {
      [entrypoint]: files[entrypoint],
    });
  } else {
    // Backwards compatibility
    includedFiles = downloadedFiles;
  }

  return includedFiles;
}


export async function getComposerFiles(workPath: string): Promise<Files> {
  console.log('🐘 Installing Composer deps.');

  // Install composer dependencies
  await runComposerInstall(workPath);

  console.log('🐘 Installing Composer deps OK.');

  return await glob('vendor/**', workPath);
}

async function runComposerInstall(cwd: string) {
  // @todo think about allow to pass custom commands here
  await runPhp(cwd,
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
    { stdio: 'inherit' }
  );
}

async function runPhp(cwd: string, args: any[], opts = {}) {
  try {
    await spawnAsync(
      'php',
      [`-dextension_dir=${PHP_MODULES_DIR}`, ...args],
      cwd,
      {
        ...opts,
        ...{
          env: {
            ...process.env,
            ...{
              COMPOSER_HOME: '/tmp',
              PATH: `${PHP_BIN_DIR}:${process.env.PATH}`,
              LD_LIBRARY_PATH: `${PHP_LIB_DIR}:${PHP_LIB64_DIR}:/usr/lib64:/lib64:${process.env.LD_LIBRARY_PATH}`
            }
          }
        }
      }
    );
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

function spawnAsync(command: string, args: any[], cwd?: string, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "ignore",
      cwd,
      ...opts
    });

    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Exited with ${code || signal}`));
      }
    });
  })
}
