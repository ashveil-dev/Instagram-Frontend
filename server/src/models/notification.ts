import { Schema } from "mongoose";

const NotificationSchema = new Schema({
	recipient: {
		type: Schema.Types.ObjectId,
		ref: "user",
		required: true,
		index: true,
	},
	actor: {
		type: Schema.Types.ObjectId,
		ref: "user",
		required: true,
	},
	type: {
		type: String,
		enum: ["follow", "like", "comment", "message"],
		required: true,
	},
	postId: {
		type: Schema.Types.ObjectId,
		ref: "post",
	},
	commentId: {
		type: Schema.Types.ObjectId,
		ref: "comment",
	},
	conversationId: {
		type: Schema.Types.ObjectId,
		ref: "conversation",
	},
	body: {
		type: String,
		default: "",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

NotificationSchema.index({ recipient: 1, createdAt: -1 });

export default NotificationSchema;
