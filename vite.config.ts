import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		dts({
			insertTypesEntry: true,
		}),
	],
	resolve: {},
	build: {
		lib: {
			entry: {
				main: resolve(__dirname, "src/main.ts"),
			},
			name: "webworkerize",
		},
		minify: false,
		rollupOptions: {
			external: [],
			output: {
				globals: {},
			},
		},
	},
});
