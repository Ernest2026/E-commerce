const mongoose = require("mongoose");

const storeSchema = mongoose.Schema(
	{
		address: {
			name: {
				type: String,
			},
			state: {
				type: String,
			},
			keyword: [],
			country: {
				type: String,
			},
			location: {
				coordinate: [],
			},
		},
	},
	{
		versionKey: false,
	}
);

exports.Store = mongoose.model("Store", storeSchema);
