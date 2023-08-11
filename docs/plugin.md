---
title: Vite Plugin
outline: deep
---

# Vite Plugin

The vite plugin is used to compile the worker modules into separate files that can be utilized in your project.

## Usage

The plugin needs to be added to the `vite.config.js` or `vite.config.ts` file.

```ts
import { defineConfig } from "vite";
import { simpleWorkerPlugin } from "simple-worker-vite/plugin"; // [!code ++]

export default defineConfig({
	plugins: [
		simpleWorkerPlugin({ // [!code ++]
			// ... // [!code ++]
		}), // [!code ++]
	],
});
```

::: tip
It will not just bundle the worker module into one file (if they are importing other modules), but will also transpile the worker from TypeScript to JavaScript (if needed).
:::

After building the project the worker files will be in the `dist/workers/` directory (by default).

```bash
dist
├── index.html
├── assets
│   └── index.1234.js
├── workers // [!code focus]
│   ├── my-worker-name.worker.js // [!code focus]
│   └── yet-another-worker.worker.js // [!code focus]
```

## Options

The `simpleWorkerPlugin` function takes an options object with the following properties:

### publicPath

The (optional) `publicPath` option is used to specify the path where the worker files will be located when they are built.

::: info
By default it is set to `"workers/"` which means the worker files will be located in the `dist/workers/` directory.
:::

```ts
simpleWorkerPlugin({
	publicPath: "custom-path/", // [!code ++]
	// ...
}),
```

::: warning
Please note that if you change the `publicPath` option you will also need to change the `base` of the `WorkerStore` if you are using it.
:::

### minify

The (optional) `minify` option is used to specify if the worker files should be minified or not.

::: info
By default it is set to `true` which means the worker files will be minified.
:::

```ts
simpleWorkerPlugin({
	minify: false, // [!code ++]
	// ...
}),
```

### workers

The mandatory `workers` option is used to specify the workers that should be compiled.  
They always contain a `name` and a `srcPath` property.

::: info
The `name` property is used to specify the name of the worker. This is used as the identifier when spawning a worker using the `WorkerStore`.
:::

```ts
simpleWorkerPlugin({
	workers: [ // [!code ++]
		{ // [!code ++]
			name: "my-worker-name", // [!code ++]
			srcPath: "src/workers/my-worker-name.worker.ts", // [!code ++]
		}, // [!code ++]
		{ // [!code ++]
			name: "yet-another-worker", // [!code ++]
			srcPath: "src/workers/yet-another-worker.worker.ts", // [!code ++]
		}, // [!code ++]
	], // [!code ++]
	// ...
}),
```

## Utilities

The plugin also exports some utilities.

### workersFromDir

The `workersFromDir` function can be used to automatically extract the workers from a directory.

```ts
import { defineConfig } from "vite";
import { simpleWorkerPlugin, workersFromDir } from "simple-worker-vite/plugin"; // [!code ++]

export default defineConfig({
	plugins: [
		simpleWorkerPlugin({
			workers: workersFromDir("src/workers/"), // [!code ++]
			// ...
		}),
	],
});
```

::: info
It will search the directory for any files ending in `.worker.ts` or `.worker.js` and use their name as the `name` property.
:::

### workerFromFile

The `workerFromFile` function works in a similar way and uses the file name as the `name` property.

```ts
import { defineConfig } from "vite";
import { simpleWorkerPlugin, workerFromFile } from "simple-worker-vite/plugin"; // [!code ++]

export default defineConfig({
	plugins: [
		simpleWorkerPlugin({
			workers: [ // [!code ++]
				workerFromFile("src/workers/my-worker-name.worker.ts"), // [!code ++]
				workerFromFile("src/workers/yet-another-worker.worker.ts"), // [!code ++]
			], // [!code ++]
			// ...
		}),
	],
});
```

::: info
This gives you more control what files are used as workers. It will also work with files that do not end in `.worker.ts` or `.worker.js`.
:::
