import { Schema } from "mongoose";

const ConversationSchema = new Schema({
	participants: {
		type: [Schema.Types.ObjectId],
		ref: "user",
		required: true,
	},
	lastMessage: {
		type: String,
		default: "",
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

export default ConversationSchema;
