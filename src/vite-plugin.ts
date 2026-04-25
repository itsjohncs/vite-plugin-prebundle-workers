import { createFilter, Plugin, FilterPattern } from "vite";
import esbuild, { BuildOptions } from "esbuild";

export interface PrebundleWorkerOptions {
	include?: FilterPattern;
	exclude?: FilterPattern;
	configureEsBuild?: (id: string, options: BuildOptions) => BuildOptions;
}

export default function prebundleWorkers(options: PrebundleWorkerOptions): Plugin {
	if (!options.include && !options.exclude) {
		return { name: "vite-plugin-prebundle-workers" };
	}

	const filter = createFilter(options.include, options.exclude);
	const configure = options.configureEsBuild ?? ((_, x) => x);

	// Extract bare filenames from the include pattern so we can match
	// them in new Worker() calls within importing files.
	const includePatterns = Array.isArray(options.include)
		? options.include.map(String)
		: options.include
			? [String(options.include)]
			: [];
	const workerBasenames = new Set(
		includePatterns.map((p) => {
			const lastSlash = p.lastIndexOf("/");
			return lastSlash >= 0 ? p.substring(lastSlash + 1) : p;
		}),
	);

	return {
		name: "vite-plugin-prebundle-workers",
		enforce: "pre",
		async load(id: string) {
			// Strip query strings (e.g. ?worker_file&type=module) that Vite
			// appends to worker imports before matching against the filter.
			const cleanId = id.split("?")[0];
			if (!filter(cleanId)) {
				return undefined;
			}

			const result = await esbuild.build(
				configure(cleanId, {
					entryPoints: [cleanId],
					bundle: true,
					format: "iife",
					platform: "browser",
					write: false,
					outfile: "out.js",
				}),
			);

			if (result.outputFiles?.length !== 1) {
				const numFiles = result.outputFiles?.length;
				throw new Error(`Expected 1 output file, got ${numFiles}.`);
			}

			return result.outputFiles[0].text;
		},
		// Rewrite new Worker() calls to remove {type: "module"} for
		// workers we're prebundling. Our IIFE bundle must be loaded as
		// a classic worker so that importScripts() works.
		transform(code: string, _id: string) {
			let hasMatch = false;
			for (const basename of workerBasenames) {
				if (code.includes(basename)) {
					hasMatch = true;
					break;
				}
			}
			if (!hasMatch) {
				return undefined;
			}

			const workerPattern =
				/(new\s+Worker\s*\(\s*new\s+URL\s*\([^)]+\))\s*,\s*\{\s*type\s*:\s*["']module["']\s*,?\s*\}\s*,?\s*\)/g;
			const transformed = code.replace(workerPattern, "$1)");

			if (transformed === code) {
				return undefined;
			}

			return transformed;
		},
	};
}
