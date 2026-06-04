import express from "express";

import mongoose from "mongoose";

import dotenv from "dotenv";

import cors from "cors";

import userRouter from "./routes/user";

import userAuthRouter from "./routes/userAuth";

import postRouter from "./routes/post";

import commentRouter from "./routes/comment";

import notificationRouter from "./routes/notification";

import messageRouter from "./routes/message";

import checkMiddleware from "./middlewares/check";

import { getMongoUri } from "./utils/mongoUri";



dotenv.config();



const { PORT } = process.env;



const app = express();



app.use(cors());

app.use(express.json());

app.use(express.static("files"));

app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);

app.use("/api/user", checkMiddleware, userAuthRouter);

app.use("/api/post", checkMiddleware, postRouter);

app.use("/api/comment", checkMiddleware, commentRouter);

app.use("/api/notification", checkMiddleware, notificationRouter);

app.use("/api/message", checkMiddleware, messageRouter);



export async function startServer(): Promise<void> {

	const mongoUri = getMongoUri();



	await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 30_000 });

	const listenPort = Number(PORT) || 4000;



	app.listen(listenPort, "0.0.0.0", () => {

		console.log(

			`[Server] API server running at http://0.0.0.0:${listenPort}`

		);

	});

}

/** 개발용: ts-node-dev ./src/app.ts (배포 시드 없이 서버만) */
const entryScript = process.argv[1] ?? "";
if (entryScript.includes("app.ts") || entryScript.includes("app.js")) {
	startServer().catch((error) => {
		console.error("[Server] Failed to start:", error);
		process.exit(1);
	});
}

