# @yukiakai/find-up

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]

[![Build Status][github-build-url]][github-url]
[![codecov][codecov-image]][codecov-url]

Find the first file matching a given pattern in the current directory or the nearest ancestor directory, with support for **both CommonJS and ESM**, and extended matching capabilities including `RegExp`, symlink control, and custom matchers callback.

> 💡 Useful for finding files or folders (like `package.json`, `.git`, or config files) by walking upward from a starting directory.

---

## 📦 Installation

```bash
npm install @yukiakai/find-up
```

Works with both `require()` and `import` thanks to dual CJS/ESM build.

---

## 🚀 Usage

### Basic usage

```ts
import { findUp } from '@yukiakai/find-up'

// Find 'package.json' starting from current directory and walking upward
const path = findUp('package.json')
console.log(path)
```

### Match multiple names

```ts
findUp(['pnpm-lock.yaml', 'yarn.lock', 'package-lock.json'])
```

### Match using RegExp

```ts
findUp(/^config\..*\.json$/)
```

### Match folders instead of files

```ts
// Return full path including matched folder name
findUp(['node_modules', 'dist'], {
  type: 'folder',
  includeMatchedPath: true
})
// → /root/project/node_modules
```

### Custom matcher callback

```ts
import fs from 'node:fs'

findUp('config.json', {
  matcher: (path) => {
    const content = fs.readFileSync(path, 'utf8')
	// Return true to accept (stop searching), false to continue searching.
    return true
  }
})
```

---

## 🧠 API

See docs: [https://yukiakai212.github.io/find-up/](https://yukiakai212.github.io/find-up/)

```ts
findUp(
  name: string | RegExp | (string | RegExp)[],
  options?: FindUpOptions
): string | undefined
```

### Options

| Name                 | Type                              | Default             | Description                                                 |
|----------------------|-----------------------------------|---------------------|-------------------------------------------------------------|
| `basedir`            | `string`                          | `process.cwd()`     | Directory to start searching from                           |
| `matcher`            | `(path: string) => ()`            | –                   | Called when a matching file is found. Return false to skip. |
| `type`               | `file \| folder`                  | `file`              | Whether to match files or directories                       |
| `includeMatchedPath` | `boolean`                         | `false`             | If `true`, returns full path including the matched name     |
| `allowSymlinks`      | `boolean`                         | `true`              | Whether to allow matching symlinks                          |
| `stopAt`             | `string \| string[]`              | -                   | Stop searching when encountering these folders              |

---

## ✅ Features

- ✅ Supports both **CommonJS** and **ESM**
- ✅ Supports `string`, `string[]`, `RegExp`, `RegExp[]`
- ✅ Supports stop at
- ✅ File or folder matching
- ✅ Optional symlink filtering
- ✅ **Custom matcher callback** — inspect file content, metadata, or path before accepting match
- ✅ TypeScript types included
- ✅ Optional: return full matched path (includeMatchedPath)



---

## 🧪 Example: Find `.git` folder

```ts
const gitFolder = findUp('.git', { type: 'folder' })
if (gitFolder) {
  console.log('Found .git at:', gitFolder)
}
```

---

## 🔍 Comparison

| Feature                            | @yukiakai/find-up | find-up       | findup-sync   |
|------------------------------------|-------------------|---------------|---------------|
| Supports CJS & ESM                 | ✅                | ❌ (ESM only) | ✅ (CJS only) |
| Supports RegExp                    | ✅                | ❌            | ✅            |
| Supports array of names/patterns   | ✅                | ✅            | ✅            |
| File/folder type filtering         | ✅                | ✅            | ❌            |
| Matcher can read file content      | ✅                | ❌            | ❌            |
| Supports Symlinks                  | ✅                | ✅            | ❌            |
| Zero dependency                    | ✅                | ❌            | ❌            |


---

## 📦 Changelog

See full release notes in [CHANGELOG.md][changelog-url]

---

## 📜 License

MIT © [yukiakai](https://github.com/yukiakai212)

[npm-downloads-image]: https://badgen.net/npm/dm/@yukiakai/find-up
[npm-downloads-url]: https://www.npmjs.com/package/@yukiakai/find-up
[npm-url]: https://www.npmjs.com/package/@yukiakai/find-up
[npm-version-image]: https://badgen.net/npm/v/@yukiakai/find-up
[github-build-url]: https://github.com/yukiakai212/find-up/actions/workflows/build.yml/badge.svg
[github-url]: https://github.com/yukiakai212/find-up/
[codecov-image]: https://codecov.io/gh/yukiakai212/find-up/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/yukiakai212/find-up
[changelog-url]: https://github.com/yukiakai212/find-up/blob/main/CHANGELOG.md
