import type { Plugin, ResolvedConfig, transformWithEsbuild } from "vite";
import * as esbuild from "esbuild";
import * as path from "path";
import * as fs from "fs";

export interface WorkerOptions {
	name: string;
	srcPath: string;
}
export interface SimpleWorkerOptions {
	publicPath?: string;
	workers: WorkerOptions[];
	minify?: boolean;
}

let config: {
	publicPath: string;
	workers: WorkerOptions[];
	minify: boolean;
} = {
	publicPath: "workers/",
	workers: [],
	minify: true,
};
export { config };

export function simpleWorkerPlugin(options: SimpleWorkerOptions): Plugin {
	config = {
		publicPath: options.publicPath || "workers/",
		workers: options.workers || [],
		minify: options.minify ?? true,
	};

	return {
		name: "simple-worker-vite",
		async load(id: string) {
			// if (!match(id)) {
			// 	continue;
			// }
			if (!id.includes("DetectGridWidthWorker")) {
				return undefined;
			}

			const result = await esbuild.build({
				entryPoints: [id],
				bundle: true,
				minify: config.minify,
				legalComments: config.minify ? "none" : undefined,
				format: "iife",
				platform: "browser",
				write: false,
				outfile: "out.js",
			});

			if (result.outputFiles?.length !== 1) {
				console.log(result);
				const numFiles = result.outputFiles?.length;
				throw new Error(`Expected 1 output file, got ${numFiles}.`);
			}

			return result.outputFiles[0].text;
		},
	};
}

export function workerFromFile(path: string): WorkerOptions {
	const name = path.split("/").pop()?.split(".").shift() || "worker";
	return {
		name,
		srcPath: path,
	};
}
export function workersFromDir(dir: string): WorkerOptions[] {
	const files = fs.readdirSync(dir);
	const workers = files
		.filter((file) => file.includes(".worker"))
		.map((file) => workerFromFile(path.join(dir, file)));
	return workers;
}
