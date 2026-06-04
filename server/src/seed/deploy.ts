import mongoose from "mongoose";
import { getMongoUri } from "../utils/mongoUri";
import { syncAllCollections, getDeployMetaModel } from "./syncCollections";
import { runSeed } from "./runSeed";

const DEPLOY_META_KEY = "initial_seed";

export async function runDeploySetup(): Promise<void> {
	if (process.env.RUN_DEPLOY_SEED === "false") {
		console.log("[deploy] RUN_DEPLOY_SEED=false — skipping DB setup.");
		return;
	}

	const uri = getMongoUri();
	console.log("[deploy] Connecting to MongoDB...");
	await mongoose.connect(uri, { serverSelectionTimeoutMS: 30_000 });

	try {
		await syncAllCollections();

		const DeployMeta = getDeployMetaModel();
		const force = process.env.FORCE_DEPLOY_SEED === "true";
		const meta = await DeployMeta.findOne({ key: DEPLOY_META_KEY });

		if (meta?.completed && !force) {
			console.log(
				"[deploy] Initial seed already completed. Skipping (set FORCE_DEPLOY_SEED=true to re-run)."
			);
			return;
		}

		console.log("[deploy] Running initial seed (users, feed, reels)...");
		await runSeed({ reset: force });

		await DeployMeta.findOneAndUpdate(
			{ key: DEPLOY_META_KEY },
			{
				key: DEPLOY_META_KEY,
				completed: true,
				version: 1,
				completedAt: new Date(),
			},
			{ upsert: true }
		);

		console.log("[deploy] Initial deployment seed completed.");
	} finally {
		await mongoose.disconnect();
	}
}

if (require.main === module) {
	runDeploySetup()
		.then(() => process.exit(0))
		.catch((error) => {
			console.error("[deploy] Failed:", error);
			process.exit(1);
		});
}
