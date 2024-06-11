<h1 align="center">vite-plugin-prebundle-workers</h1>
<div align="center">
    
[![npm version](https://badge.fury.io/js/vite-plugin-prebundle-workers.svg)](https://www.npmjs.com/package/vite-plugin-prebundle-workers)
[![npm](https://img.shields.io/npm/dm/vite-plugin-prebundle-workers)](https://www.npmjs.com/package/vite-plugin-prebundle-workers)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center">Bundle classic Vite web workers during development.</p>

Vite will bundle classic web workers at build time but not during development. This can cause some development-only bugs (ex: vitejs/vite#8470) since imports won't be supported during development but will be in production. This is a simple Vite plugin that will force your web workers to be bundled during development too.

## 🚀 Usage <a name="usage"></a>

### Install

```bash
npm install vite-plugin-prebundle-workers
```

### Add to vite config

```js
// vite.config.js
import { defineConfig } from "vite";
import prebundleWorkers from "vite-plugin-prebundle-workers";

export default defineConfig({
    plugins: [
        prebundleWorkers({
            include: "src/myGreatWorker.ts"
        })
    ],
});
```

Options are:

* `include` and `exclude`: Passed to `createFilter` ([docs](https://www.npmjs.com/package/@rollup/pluginutils#include-and-exclude)). One of them must be truthy or an error is thrown.
* `configureEsBuild`: A function that's given the `id` of the file (usually a file path) and the configuration that would be passed to `esbuild.build` by default. Should return the configuration to pass to `esbuild.build`.

### Use your Web Worker normally

```ts
const worker = new Worker(new URL("./myGreatWorker.ts", import.meta.url));
```

## A fork of...

Forked off from [simple-worker-vite](https://github.com/jason-rietzke/simple-worker-vite). This fork ended up being pretty much entirely different though so I created a new plugin instead of trying to submit patches upstream.
