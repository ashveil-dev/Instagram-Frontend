import mongoose from "mongoose";
import NotificationSchema from "../models/notification";

export type NotificationType = "follow" | "like" | "comment" | "message";

function getNotificationModel() {
	return mongoose.model("notification", NotificationSchema);
}

export async function createNotification(params: {
	recipientId: string;
	actorId: string;
	type: NotificationType;
	postId?: string;
	commentId?: string;
	conversationId?: string;
	body?: string;
}) {
	const { recipientId, actorId, type } = params;
	if (recipientId === actorId) {
		return;
	}

	const NotificationModel = getNotificationModel();
	const filter: Record<string, unknown> = {
		recipient: recipientId,
		actor: actorId,
		type,
	};

	if (params.postId) {
		filter.postId = params.postId;
	}
	if (params.commentId) {
		filter.commentId = params.commentId;
	}
	if (params.conversationId) {
		filter.conversationId = params.conversationId;
	}

	const update: Record<string, unknown> = {
		recipient: recipientId,
		actor: actorId,
		type,
		body: params.body ?? "",
		createdAt: new Date(),
	};

	if (params.postId) update.postId = params.postId;
	if (params.commentId) update.commentId = params.commentId;
	if (params.conversationId) update.conversationId = params.conversationId;

	if (type === "follow") {
		delete filter.postId;
		delete filter.commentId;
		delete filter.conversationId;
	}
	if (type === "comment" && params.commentId) {
		delete filter.postId;
	}

	await NotificationModel.findOneAndUpdate(filter, update, {
		upsert: true,
		new: true,
	});
}

export async function removeNotification(params: {
	recipientId: string;
	actorId: string;
	type: NotificationType;
	postId?: string;
	conversationId?: string;
}) {
	const NotificationModel = getNotificationModel();
	const filter: Record<string, unknown> = {
		recipient: params.recipientId,
		actor: params.actorId,
		type: params.type,
	};

	if (params.postId) {
		filter.postId = params.postId;
	}
	if (params.conversationId) {
		filter.conversationId = params.conversationId;
	}

	await NotificationModel.deleteOne(filter);
}
