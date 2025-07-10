import { describe, it, expect } from 'vitest';
import module from 'node:module';
import * as core from '../src/index.js';
import * as esm from '../dist/index.js';
const require = module.createRequire(import.meta.url);
const cjs = require('../dist/index.cjs');

describe.each([
  ['Core', core],
  ['ESM', esm],
  ['CJS', cjs],
])('findUp (%s)', (name, lib) => {
  it('should find package.json upward', () => {
    const result = lib.findUp('package.json', { basedir: import.meta.dirname });

    expect(result).toBeTruthy();
  });
  it('should find package.json with array mode', () => {
    const result = lib.findUp(['package.json'], { basedir: import.meta.dirname });

    expect(result).toBeTruthy();
  });

  it('should support regex name match', () => {
    const result = lib.findUp(/package\.json$/, { basedir: import.meta.dirname });
    expect(result).toBeTruthy();
  });

  it('should not match anything', () => {
    const result = lib.findUp('this-not-exist', { basedir: import.meta.dirname });
    expect(result).toBe(undefined);
  });

  it('should respect custom matcher (stop)', () => {
    const matched = [];
    const result = lib.findUp('package.json', {
      basedir: import.meta.dirname,
      matcher: (path) => {
        matched.push(path);
        return true;
      },
    });
    expect(matched.length).toBeGreaterThan(0);
    expect(result).toBeTruthy();
  });
  it('should respect custom matcher (continue)', () => {
    const result = lib.findUp('package.json', {
      basedir: import.meta.dirname,
      matcher: (path) => {
        return false;
      },
    });
    expect(result).toBe(undefined);
  });
});
