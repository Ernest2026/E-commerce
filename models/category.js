const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
	{
		name: {
			type: String,
		},
		created_at: {
			type: Date,
			default: Date.now,
		},
		updated_at: {
			type: Date,
			default: Date.now,
		},
	},
	{
		versionKey: false,
	}
);

exports.Category = mongoose.model("Category", categorySchema);
