import express from "express";
import mongoose from "mongoose";
import UserSchema from "../models/user";
import ConversationSchema from "../models/conversation";
import MessageSchema from "../models/message";
import { createNotification } from "../utils/notifications";

const router = express.Router();

router.get("/conversations", async (req, res) => {
	try {
		const ConversationModel = mongoose.model(
			"conversation",
			ConversationSchema
		);
		const UserModel = mongoose.model("user", UserSchema);
		const MessageModel = mongoose.model("message", MessageSchema);

		const conversations = await ConversationModel.find({
			participants: req.user.id,
		}).sort({ updatedAt: -1 });

		const result = [];
		for (const conversation of conversations) {
			const otherId = conversation.participants.find(
				(id) => id.toString() !== req.user.id
			);
			if (!otherId) continue;
			const other = await UserModel.findById(otherId);
			if (!other) continue;

			const unreadCount = await MessageModel.countDocuments({
				conversation: conversation._id,
				sender: { $ne: req.user.id },
			});

			result.push({
				id: conversation.id,
				nickName: other.nickName,
				fullName: other.fullName,
				photo: other.photo,
				lastMessage: conversation.lastMessage,
				updatedAt: conversation.updatedAt,
				unreadCount,
			});
		}

		return res.send({ conversations: result });
	} catch {
		return res.status(500).send({ message: "Unknown error" });
	}
});

router.post("/conversations", async (req, res) => {
	const { recipientId } = req.body;
	if (!recipientId) {
		return res.status(400).send({ message: "Inputs are invalid" });
	}

	try {
		const ConversationModel = mongoose.model(
			"conversation",
			ConversationSchema
		);
		const UserModel = mongoose.model("user", UserSchema);

		const recipient = await UserModel.findById(recipientId);
		if (!recipient) {
			return res.status(400).send({ message: "User does not exist" });
		}

		let conversation = await ConversationModel.findOne({
			participants: { $all: [req.user.id, recipientId] },
		});

		if (!conversation) {
			conversation = await new ConversationModel({
				participants: [req.user.id, recipientId],
			}).save();
		}

		return res.send({
			id: conversation.id,
			nickName: recipient.nickName,
			fullName: recipient.fullName,
			photo: recipient.photo,
			lastMessage: conversation.lastMessage,
			updatedAt: conversation.updatedAt,
		});
	} catch {
		return res.status(500).send({ message: "Unknown error" });
	}
});

router.get("/conversations/:id/messages", async (req, res) => {
	const { id } = req.params;

	try {
		const ConversationModel = mongoose.model(
			"conversation",
			ConversationSchema
		);
		const MessageModel = mongoose.model("message", MessageSchema);
		const UserModel = mongoose.model("user", UserSchema);

		const conversation = await ConversationModel.findById(id);
		if (
			!conversation ||
			!conversation.participants.some(
				(p) => p.toString() === req.user.id
			)
		) {
			return res.status(400).send({ message: "Conversation not found" });
		}

		const messages = await MessageModel.find({ conversation: id }).sort({
			createdAt: 1,
		});

		const otherId = conversation.participants.find(
			(p) => p.toString() !== req.user.id
		);
		const other = otherId ? await UserModel.findById(otherId) : null;

		return res.send({
			conversation: {
				id: conversation.id,
				nickName: other?.nickName ?? "",
				photo: other?.photo ?? "",
			},
			messages: messages.map((msg) => ({
				id: msg.id,
				body: msg.body,
				senderId: msg.sender.toString(),
				isMine: msg.sender.toString() === req.user.id,
				createdAt: msg.createdAt,
			})),
		});
	} catch {
		return res.status(500).send({ message: "Unknown error" });
	}
});

router.post("/conversations/:id/messages", async (req, res) => {
	const { id } = req.params;
	const { body } = req.body;

	if (!body || typeof body !== "string" || body.trim() === "") {
		return res.status(400).send({ message: "Inputs are invalid" });
	}

	try {
		const ConversationModel = mongoose.model(
			"conversation",
			ConversationSchema
		);
		const MessageModel = mongoose.model("message", MessageSchema);

		const conversation = await ConversationModel.findById(id);
		if (
			!conversation ||
			!conversation.participants.some(
				(p) => p.toString() === req.user.id
			)
		) {
			return res.status(400).send({ message: "Conversation not found" });
		}

		const message = await new MessageModel({
			conversation: id,
			sender: req.user.id,
			body: body.trim(),
		}).save();

		conversation.lastMessage = body.trim();
		conversation.updatedAt = new Date();
		await conversation.save();

		const recipientId = conversation.participants.find(
			(p) => p.toString() !== req.user.id
		);
		if (recipientId) {
			await createNotification({
				recipientId: recipientId.toString(),
				actorId: req.user.id,
				type: "message",
				conversationId: conversation.id,
				body: body.trim(),
			});
		}

		return res.send({
			id: message.id,
			body: message.body,
			senderId: message.sender.toString(),
			isMine: true,
			createdAt: message.createdAt,
		});
	} catch {
		return res.status(500).send({ message: "Unknown error" });
	}
});

export default router;
