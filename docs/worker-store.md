---
title: WorkerStore
outline: deep
---

# WorkerStore

The `WorkerStore` class is a utility that can be used to make it easier to use the workers in your project.
It is not required though, and you can load the workers by themselves if you prefer.

## Usage

```ts
import { WorkerStore } from "simple-worker-vite";
const workerStore = new WorkerStore();

workerStore
	.spawn("my-worker-name")
	.then((worker) => {
		worker.addEventListener("message", (event) => {
			// ...
		});
		worker.postMessage("Hello World!");
	});
```

The `WorkerStore` class is a singleton, so you can import and instantiate it anywhere in your project and it will always be the same instance.

::: tip
The `WorkerStore` has the advantage that it will cache the workers so that they only need to be downloaded once and won't cause any further network requests.
:::

### spawn

The `spawn` method is used to load a worker by name. It returns a promise that resolves to the worker instance which can then be used as you would normally use a web worker.

This is where the `name` property used in the vite config comes into play.

```ts
workerStore.spawn("my-worker-name");
```

## Base Path

The `WorkerStore` will automatically load the worker from the `/workers/` path (by default).

You can change this by setting the argument when instantiating the `WorkerStore`.

```ts
const workerStore = new WorkerStore("/workers/");
```

or by setting the `base` property.

```ts
workerStore.base = "/workers/";
```

::: tip
Changing the `base` property is especially important if you changed the `publicPath` option in the vite config.
Aside from that, it is recommended to keep the default value.
:::
