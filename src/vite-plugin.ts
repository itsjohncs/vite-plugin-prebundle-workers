import { createFilter, Plugin, FilterPattern } from "vite";
import esbuild, { BuildOptions } from "esbuild";

export interface SimpleWorkerOptions {
	include?: FilterPattern;
	exclude?: FilterPattern;
	configureEsBuild?: (id: string, options: BuildOptions) => BuildOptions;
}

export function simpleWorkerPlugin(options: SimpleWorkerOptions): Plugin {
	if (!options.include && !options.exclude) {
		return { name: "vite-plugin-prebundle-workers" };
	}

	const filter = createFilter(options.include, options.exclude);
	const configure = options.configureEsBuild ?? ((_, x) => x);

	return {
		name: "vite-plugin-prebundle-workers",
		async load(id: string) {
			if (!filter(id)) {
				return undefined;
			}

			const result = await esbuild.build(
				configure(id, {
					entryPoints: [id],
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
	};
}
