const glob = require('@now/build-utils/fs/glob.js');

async function getFiles() {
  // Lookup for all files in native folder
  return await glob('native/**', __dirname);
}

module.exports = {
  getFiles,
};
