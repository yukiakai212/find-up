import path from 'node:path';
import fs from 'node:fs';

export interface FindUpOptions {
  basedir?: string;
  matcher?: (path: string) => void | boolean;
  type?: 'file' | 'folder';
  allowSymlinks?: boolean;
  stopAt?: string | string[];
  includeMatchedPath?: boolean;
}

function matchName(
  base: string,
  target: string[],
  expect: string | RegExp,
  type: 'file' | 'folder',
  allowSymlinks: boolean,
): string | undefined {
  for (let name of target) {
    try {
      const fullPath = path.join(base, name);
      const realPath = fs.realpathSync(fullPath);
      const realName = path.basename(realPath);
      if (!allowSymlinks && name !== realName) continue;
      name = realName;

      const stats = fs.statSync(realPath);
      if (type === 'file' && !stats.isFile()) continue;
      if (type === 'folder' && !stats.isDirectory()) continue;
      if (name === expect || (expect instanceof RegExp && expect.test(name))) return name;
    } catch {
      //ok
    }
  }
}

export function findUp(name: string | RegExp, options?: FindUpOptions): string | undefined;
export function findUp(name: (string | RegExp)[], options?: FindUpOptions): string | undefined;

export function findUp(
  name: (string | RegExp) | (string | RegExp)[],
  options: FindUpOptions = {},
): string | undefined {
  const {
    basedir = process.cwd(),
    matcher,
    type = 'file',
    allowSymlinks = true,
    stopAt = [],
    includeMatchedPath = false,
  } = options;

  if (name instanceof Array) {
    for (const oneName of name) {
      const found = findUp(oneName, options);
      if (found) return found;
    }
    return undefined;
  }
  const expect = name;
  const stopAtName = typeof stopAt === 'string' ? [stopAt] : stopAt;

  let dir = path.resolve(basedir);

  while (true) {
    const entries = fs.readdirSync(dir);
    const found = matchName(dir, entries, expect, type, allowSymlinks);
    if (found) {
      if (matcher && !matcher(path.join(dir, found))) {
        //continue search
      } else {
        return includeMatchedPath ? path.join(dir, found) : dir;
      }
    }
    const oldDir = dir;
    dir = path.join(dir, '..');
    if (dir === oldDir || stopAtName.includes(path.basename(dir))) break;
  }

  return undefined;
}
