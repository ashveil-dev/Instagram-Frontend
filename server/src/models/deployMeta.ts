import { Schema } from "mongoose";

const DeployMetaSchema = new Schema({
	key: {
		type: String,
		required: true,
		unique: true,
	},
	completed: {
		type: Boolean,
		default: false,
	},
	version: {
		type: Number,
		default: 1,
	},
	completedAt: {
		type: Date,
	},
});

export default DeployMetaSchema;
