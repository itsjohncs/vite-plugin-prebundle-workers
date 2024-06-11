<h1 align="center">vite-plugin-prebundle-workers</h1>

<div align="center">

[![npm version](https://badge.fury.io/js/vite-plugin-prebundle-workers.svg)](https://www.npmjs.com/package/vite-plugin-prebundle-workers)
[![npm](https://img.shields.io/npm/dm/vite-plugin-prebundle-workers)](https://www.npmjs.com/package/vite-plugin-prebundle-workers)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> Bundle classic Vite web workers during development.
    <br> 
</p>

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
            include: "src/myGreatWorker.js"
        })
    ],
});
```

## A fork of...

Forked off from [simple-worker-vite](https://github.com/jason-rietzke/simple-worker-vite).
