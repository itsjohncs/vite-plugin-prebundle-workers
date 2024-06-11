import fs from "fs";
import path from "path";
import { defineConfig, type Plugin } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		dts({
			insertTypesEntry: true,
		}),
		mdts(),
	],
	resolve: {},
	build: {
		lib: {
			entry: {
				"vite-plugin": resolve(__dirname, "src/vite-plugin.ts"),
			},
			name: "vite-plugin-prebundle-workers",
			formats: ["es", "cjs"],
		},
		minify: false,
		rollupOptions: {
			external: ["vite", "esbuild", "path", "fs"],
			output: {
				globals: {},
			},
		},
	},
});

function mdts(): Plugin {
	let distPath: string;
	return {
		name: "vite:dmts",
		configResolved(getResolvedConfig) {
			const resolvedConfig = getResolvedConfig;
			distPath = path.join(resolvedConfig.root, resolvedConfig.build.outDir, resolvedConfig.base);
		},
		writeBundle() {
			const files = fs.readdirSync(distPath);
			for (const file of files) {
				if (file.endsWith(".d.ts")) {
					const filePath = path.join(distPath, file);
					const content = fs.readFileSync(filePath, "utf-8");
					fs.writeFileSync(filePath.replace(".d.ts", ".d.mts"), content);
				}
			}
		},
	};
}
