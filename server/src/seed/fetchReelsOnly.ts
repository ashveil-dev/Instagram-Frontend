import dotenv from "dotenv";
import path from "path";
import { ensureDirectories, ensureReelVideos } from "./ensureAssets";

dotenv.config({ path: path.join(process.cwd(), ".env") });

async function main() {
	ensureDirectories();
	await ensureReelVideos();
	console.log("[seed:reels] Done.");
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
