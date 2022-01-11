const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
	{
		orderItems: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "OrderDetail",
				required: true,
			},
		],
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		state_country: {
			type: String,
			required: true,
		},
		city_zipcode: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		total: {
			type: String,
			required: true,
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

exports.Order = mongoose.model("Order", orderSchema);
