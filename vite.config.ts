import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const base = env.VITE_BASE_PATH || "/";

	return {
		base,
		server: {
			port: 4173,
			host: "0.0.0.0",
			proxy: {
				"/api": {
					target: "http://localhost:4000/",
					changeOrigin: true,
					secure: false,
					ws: true,
				},
				"/images": {
					target: "http://localhost:4000/",
					changeOrigin: true,
				},
				"/videos": {
					target: "http://localhost:4000/",
					changeOrigin: true,
				},
			},
		},
		plugins: [react(), tsconfigPaths(), svgr()],
	};
});
