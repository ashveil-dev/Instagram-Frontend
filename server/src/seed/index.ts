import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { getMongoUri } from "../utils/mongoUri";
import { runSeed } from "./runSeed";

dotenv.config({ path: path.join(process.cwd(), ".env") });

async function main() {
	const reset = process.argv.includes("--reset");

	await mongoose.connect(getMongoUri());
	try {
		await runSeed({ reset });
	} finally {
		await mongoose.disconnect();
	}

	console.log("[seed] Done.");
}

main().catch((error) => {
	console.error("[seed] Failed:", error);
	process.exit(1);
});
