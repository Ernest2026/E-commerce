const mongoose = require("mongoose");

const orderDetailSchema = mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		quantity: {
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

exports.OrderDetail = mongoose.model("OrderDetail", orderDetailSchema);
