import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: 4173,
		host: "0.0.0.0",
		proxy : {
			"/api" : {
				target : "https://52.63.35.30:4000/instagram",
				changeOrigin : true,
				rewrite : (path) => path.replace(/^\/api/, ''),
				secure: false,
				ws : true
			}
		}
	},
	plugins: [react(), tsconfigPaths(), svgr()],
});
