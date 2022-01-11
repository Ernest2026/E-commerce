const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		phonenumber: {
			type: String,
			default: "",
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
	},
	{
		versionKey: false,
	}
);

exports.User = mongoose.model("User", userSchema);
