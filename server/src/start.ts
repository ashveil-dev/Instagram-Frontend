import dotenv from "dotenv";
import path from "path";
import { runDeploySetup } from "./seed/deploy";
import { startServer } from "./app";

dotenv.config({ path: path.join(process.cwd(), ".env") });

async function bootstrap() {
	try {
		await runDeploySetup();
		await startServer();
	} catch (error) {
		console.error("[Server] Bootstrap failed:", error);
		process.exit(1);
	}
}

bootstrap();
