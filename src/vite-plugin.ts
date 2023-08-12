import { Plugin, ResolvedConfig } from "vite";
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
		minify: options.minify || true,
	};

	let resolvedConfig: ResolvedConfig;
	let distPath: string;

	return {
		name: "simple-worker-vite",
		configResolved(getResolvedConfig) {
			resolvedConfig = getResolvedConfig;
			distPath = path.join(
				resolvedConfig.root,
				resolvedConfig.build.outDir,
				resolvedConfig.base,
				config.publicPath,
			);
		},
		configureServer(server) {
			buildWorkers(
				{
					...config,
					minify: false,
				},
				distPath,
			);
			return () => {
				server.middlewares.use((req, res, next) => {
					if (!req.url?.includes(config.publicPath)) return next();
					const workerPath = path.join(
						resolvedConfig.root,
						resolvedConfig.build.outDir,
						resolvedConfig.base,
						req.url,
					);
					if (!fs.existsSync(workerPath)) return next();
					res.setHeader("Content-Type", "application/javascript");
					res.end(fs.readFileSync(workerPath));
				});
			};
		},
		writeBundle() {
			if (!fs.existsSync(distPath)) fs.mkdirSync(distPath, { recursive: true });
			buildWorkers(config, distPath);
		},
	};
}

function buildWorkers(config: SimpleWorkerOptions, distPath: string) {
	config.workers.forEach((worker) => {
		if (!fs.existsSync(worker.srcPath)) {
			throw new Error(`Worker file ${worker.srcPath} does not exist`);
		}
		esbuild.buildSync({
			entryPoints: [worker.srcPath],
			bundle: true,
			minify: config.minify,
			legalComments: "none",
			format: "esm",
			outfile: path.join(distPath, `${worker.name}.worker.js`),
			platform: "browser",
		});
	});
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
