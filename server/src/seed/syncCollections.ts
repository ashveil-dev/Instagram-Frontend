import mongoose from "mongoose";
import UserSchema from "../models/user";
import PostSchema from "../models/post";
import CommentSchema from "../models/comment";
import NotificationSchema from "../models/notification";
import ConversationSchema from "../models/conversation";
import MessageSchema from "../models/message";
import DeployMetaSchema from "../models/deployMeta";

const COLLECTIONS = [
	{ name: "user", schema: UserSchema },
	{ name: "post", schema: PostSchema },
	{ name: "comment", schema: CommentSchema },
	{ name: "notification", schema: NotificationSchema },
	{ name: "conversation", schema: ConversationSchema },
	{ name: "message", schema: MessageSchema },
	{ name: "deploymeta", schema: DeployMetaSchema },
] as const;

export async function syncAllCollections(): Promise<void> {
	console.log("[deploy] Syncing collections and indexes...");

	for (const { name, schema } of COLLECTIONS) {
		const model = mongoose.models[name] ?? mongoose.model(name, schema);
		await model.createCollection().catch(() => undefined);
		await model.syncIndexes();
		console.log(`[deploy]   - ${name}`);
	}
}

export function getDeployMetaModel() {
	return (
		mongoose.models.deploymeta ??
		mongoose.model("deploymeta", DeployMetaSchema)
	);
}
