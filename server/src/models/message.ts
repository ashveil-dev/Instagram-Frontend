import { Schema } from "mongoose";

const MessageSchema = new Schema({
	conversation: {
		type: Schema.Types.ObjectId,
		ref: "conversation",
		required: true,
	},
	sender: {
		type: Schema.Types.ObjectId,
		ref: "user",
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default MessageSchema;
