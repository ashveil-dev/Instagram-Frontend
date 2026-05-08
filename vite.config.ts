import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

// http://vitejs.dev/config/
export default defineConfig({
	server: {
		port: 4173,
		host: "0.0.0.0",
		proxy : {
			"/api" : {
				target : "http://localhost:4000/",
				changeOrigin : true,
				secure: false,
				ws : true
			}
		}
	},
	plugins: [react(), tsconfigPaths(), svgr()],
});
