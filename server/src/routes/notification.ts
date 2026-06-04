import express from "express";
import mongoose from "mongoose";
import UserSchema from "../models/user";
import NotificationSchema from "../models/notification";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const UserModel = mongoose.model("user", UserSchema);
		const NotificationModel = mongoose.model(
			"notification",
			NotificationSchema
		);

		const docs = await NotificationModel.find({
			recipient: req.user.id,
		})
			.sort({ createdAt: -1 })
			.limit(30);

		const notifications: {
			id: string;
			type: "follow" | "like" | "comment" | "message";
			author: string;
			authorId: string;
			authorPhoto: string;
			body?: string;
			postId?: string;
			conversationId?: string;
			createdAt: Date;
		}[] = [];

		for (const doc of docs) {
			const actor = await UserModel.findById(doc.actor);
			if (!actor) continue;

			let body = doc.body;
			if (doc.type === "like") {
				body = body || "회원님의 게시물을 좋아합니다.";
			} else if (doc.type === "message") {
				body = body || "메시지를 보냈습니다.";
			}

			notifications.push({
				id: doc.id,
				type: doc.type,
				author: actor.nickName,
				authorId: actor.id,
				authorPhoto: actor.photo,
				body,
				postId: doc.postId?.toString(),
				conversationId: doc.conversationId?.toString(),
				createdAt: doc.createdAt,
			});
		}

		return res.send({ notifications });
	} catch (e) {
		console.error(e);
		return res.status(500).send({ message: "Unknown error" });
	}
});

export default router;
