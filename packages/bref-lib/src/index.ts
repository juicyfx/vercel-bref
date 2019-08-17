import { glob } from '@now/build-utils';
import path from "path";

export async function getBrefFiles(): Promise<Files> {
  // Lookup for all files in native folder
  return await glob('native/**', { cwd: path.join(__dirname, "..") });
}
