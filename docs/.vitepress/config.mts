import { defineConfig } from "vitepress";

const url = "https://jason-rietzke.github.io/simple-worker-vite/";
const title = "Simple Worker Vite";
const description = "easy way to use web workers with vite";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	base: "/simple-worker-vite/",
	lang: "en-US",
	title: title,
	description: description,
	head: [
		["meta", { name: "author", content: "Jason Rietzke" }],
		["meta", { name: "keywords", content: "plugin,utility,worker,webworker,vite,vite-plugin" }],
		["meta", { name: "og:title", content: title }],
		["meta", { name: "og:description", content: description }],
		["meta", { name: "og:type", content: "website" }],
		["meta", { name: "og:url", content: url }],
	],
	lastUpdated: true,
	themeConfig: {
		siteTitle: title,
		nav: [
			{ text: "Plugin", link: "/plugin", activeMatch: "/plugin" },
			{ text: "WorkerStore", link: "/worker-store", activeMatch: "/worker-store" },
			{ text: "More", items: [{ text: "Changelog", link: "/CHANGELOG", activeMatch: "/CHANGELOG" }] },
		],
		socialLinks: [{ icon: "github", link: "https://github.com/jason-rietzke/simple-worker-vite" }],
	},
});
