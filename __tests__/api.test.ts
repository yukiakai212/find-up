import { describe, it, expect } from 'vitest';
import { findUp } from '../src/index.js';
import { join } from 'path';

describe('findUp', () => {
  it('should find package.json upward', () => {
    const result = findUp('package.json', { basedir: import.meta.dirname });

    expect(result).toBeTruthy();
  });
  it('should find package.json with array mode', () => {
    const result = findUp(['package.json'], { basedir: import.meta.dirname });

    expect(result).toBeTruthy();
  });

  it('should support regex name match', () => {
    const result = findUp(/package\.json$/, { basedir: import.meta.dirname });
    expect(result).toBeTruthy();
  });

  it('should not match anything', () => {
    const result = findUp('this-not-exist', { basedir: import.meta.dirname });
    expect(result).toBe(undefined);
  });

  it('should respect custom matcher', () => {
    const matched = [];
    const result = findUp('package.json', {
      basedir: import.meta.dirname,
      matcher: (path) => {
        matched.push(path);
        return true;
      },
    });
    expect(matched.length).toBeGreaterThan(0);
    expect(result).toBeTruthy();
  });
});
