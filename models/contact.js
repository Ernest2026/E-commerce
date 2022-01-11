const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
	{
		username: {
			type: String,
		},
		email: {
			type: String,
		},
		subject: {
			type: String,
		},
		message: {
			type: String,
		},
		created_at: {
			type: Date,
			default: Date.now(),
		},
		updated_at: {
			type: Date,
			default: Date.now(),
		},
	},
	{
		versionKey: false,
	}
);

exports.Contact = mongoose.model("Contact", contactSchema);
