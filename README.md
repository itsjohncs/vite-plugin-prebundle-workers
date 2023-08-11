<h1 align="center">Simple Worker Vite</h1>

<div align="center">

[![stars](https://img.shields.io/github/stars/jason-rietzke/simple-worker-vite)](https://github.com/jason-rietzke/simple-worker-vite)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)
[![npm version](https://badge.fury.io/js/simple-worker-vite.svg)](https://www.npmjs.com/package/simple-worker-vite)
[![npm](https://img.shields.io/npm/dm/simple-worker-vite)](https://www.npmjs.com/package/simple-worker-vite)
[![Deploy Docs](https://github.com/LiveReader/graphly-d3/actions/workflows/deploy-docs.yml/badge.svg)](https://github.com/LiveReader/graphly-d3/actions/workflows/deploy-docs.yml)
[![build](https://github.com/LiveReader/graphly-d3/actions/workflows/release.yml/badge.svg)](https://github.com/LiveReader/graphly-d3/actions/workflows/release.yml)

</div>

---

<p align="center"> easy way to use web workers with vite
    <br> 
</p>

## 📝 Table of Contents

-   [About](#about)
-   [Usage](#usage)
-   [Built Using](#built_using)
-   [Contributing](../CONTRIBUTING.md)
-   [Authors](#authors)

## 🧐 About <a name = "about"></a>

A vite plugin to simplify the way you can use web workers in your vite project.  
It allows you to specify the worker files in your vite config and then compile them into separate files that can be used in your project.

## 🚀 Usage <a name="usage"></a>

### Install

```bash
npm install simple-worker-vite
```

### Add to vite config

```js
// vite.config.js
import { defineConfig } from "vite";
import { simpleWorkerPlugin, workersFromDir } from "simple-worker-vite/plugin";

export default defineConfig({
	plugins: [
		simpleWorkerPlugin({
			workers: workersFromDir("src/workers/"),
		}),
	],
});
```

This will search the `src/workers/` directory for any files ending in `.worker.ts` or `.worker.js` and compile them as modules into separate files that can be found in the `dist/workers/` directory (by default).

### WorkerStore utility

The `WorkerStore` utility can be used to make it easier to use the workers in your project.

```ts
import { WorkerStore } from "simple-worker-vite";
const workerStore = new WorkerStore();

workerStore
	.spawn("my-worker-name")
	.then((worker) => {
		worker.addEventListener("message", (event) => {
			console.log(event.data);
		});
		worker.postMessage(["Hello", "World"]);
	})
	.catch(console.error);
```

The `WorkerStore` will automatically load the worker from the `/workers/` path (by default) and spawn it as a new worker.  
Form there on you can use the worker as you normally would.

For more information on how to use the library, see the [documentation](https://jason-rietzke.github.io/simple-worker-vite/).

## ⛏️ Built Using <a name = "built_using"></a>

-   [esbuild](https://esbuild.github.io/) - Bundler
-   [Vite](https://vitejs.dev/) - Bundler
-   [TypeScript](https://www.typescriptlang.org/) - Language
-   [Vitepress](https://vitepress.dev) - Documentation

## ✍️ Authors <a name = "authors"></a>

-   [@jason-rietzke](https://github.com/jason-rietzke)
