const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Product } = require("../models/product");
const { Contact } = require("../models/contact");
const { Category } = require("../models/category");
const { Store } = require("../models/store");

router.get("/searchmail", async (req, res) => {
	try {
		let result = await Contact.aggregate([
			{
				$search: {
					index: "contactac",
					compound: {
						should: [
							{
								autocomplete: {
									query: `${req.query.term}`,
									path: "username",
									fuzzy: {
										maxEdits: 2,
									},
									score: { boost: { value: 3 } },
								},
							},
							{
								autocomplete: {
									query: `${req.query.term}`,
									path: "subject",
									fuzzy: {
										maxEdits: 2,
									},
									score: { boost: { value: 2 } },
								},
							},
							{
								autocomplete: {
									query: `${req.query.term}`,
									path: "email",
									fuzzy: {
										maxEdits: 2,
									},
								},
							},
							{
								autocomplete: {
									query: `${req.query.term}`,
									path: "message",
									fuzzy: {
										maxEdits: 1,
									},
								},
							},
						],
					},
					highlight: {
						path: ["username", "message", "email", "subject"],
					},
				},
			},
			{
				$addFields: {
					highlights: { $meta: "searchHighlights" },
				},
			},
		]);
		res.send(result);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/searchstore", async (req, res) => {
	try {
		const arr = req.query.loc.split(",");
		const arrofno = arr.map(a => Number(a));

		let result = await Store.aggregate([
			{
				$search: {
					index: "storeac",
					geoWithin: {
						circle: {
							center: {
								type: "Point",
								coordinates: arrofno,
							},
							radius: 5000,
						},
						path: "address.location",
					},
				},
			},
		]);

		res.send(result);
	} catch (e) {
		if (e) {
			console.log(e);
		}
	}
});

router.get("/search", async (req, res) => {
	let val = req.query.name ? req.query.name : null;
	let color = req.query.color ? req.query.color : null;
	let tags = req.query.tags ? req.query.tags : null;
	let sortby = req.query.sortby ? req.query.sortby : null;
	let pricerange = req.query.price ? req.query.price : null;
	let price = [];

	function addSearch(val) {
		let obj = {
			$search: {
				index: "productac",
				compound: {
					should: [
						{
							autocomplete: {
								query: `${val}`,
								path: "name",
								fuzzy: {
									maxEdits: 2,
								},
								score: { boost: { value: 5 } },
							},
						},
						{
							autocomplete: {
								query: `${val}`,
								path: "description",
								fuzzy: {
									maxEdits: 2,
								},
								score: { boost: { value: 2 } },
							},
						},
					],
				},
			},
		};
		return obj;
	}
	function matchPrice(price) {
		if (req.query.price) {
			switch (req.query.price) {
				case "all":
					return;
					break;

				case "price1":
					price.push(0);
					price.push(2000);
					break;

				case "price2":
					price.push(2000);
					price.push(4000);
					break;

				case "price3":
					price.push(4000);
					price.push(1000000000000000);
					break;

				default:
					return;
					break;
			}
		}

		if (price.length === 0) {
			return;
		}
		let min = price[0];
		let max = price[1];
		let obj = {
			$match: { price: { $gte: min, $lt: max } },
		};
		return obj;
	}
	function matchColor(color) {
		if (!color || color === "all") {
			return;
		}
		let obj = {
			$match: { color: `${color}` },
		};
		return obj;
	}
	function matchTags(tags) {
		if (!tags || tags === "all") {
			return;
		}
		let obj = {
			$match: { tags: { $eq: `${tags}` } },
		};
		return obj;
	}
	function sortPrice(sortby) {
		if (sortby !== "lowhigh" && sortby !== "highlow") {
			return;
		}
		if (sortby === "lowhigh") {
			var price = 1;
		}
		if (sortby === "highlow") {
			var price = -1;
		}
		let obj = {
			$sort: {
				price: price,
			},
		};
		return obj;
	}
	function newest(sortby) {
		if (sortby !== "newness") {
			return;
		}
		let obj = {
			$sort: {
				created_at: 1,
			},
		};
		return obj;
	}
	function limit(num) {
		let obj = {
			$limit: num,
		};
		return obj;
	}
	function createPipeline(val, price, color, tags, sortby) {
		let pipeline = [];

		pipeline.push(addSearch(val));
		pipeline.push(matchPrice(price));
		pipeline.push(matchColor(color));
		pipeline.push(matchTags(tags));
		pipeline.push(sortPrice(sortby));
		pipeline.push(newest(sortby));
		if (req.query.type === "autocomplete") {
			pipeline.push(limit(5));
		}

		return pipeline.filter(a => a);
	}
	const index = createPipeline(val, price, color, tags, sortby);

	try {
		const product = await Product.aggregate(index);

		const category = await Category.find().select("name");

		if (req.query.type === "autocomplete") {
			res.send(product);
		} else {
			res.render("product", {
				product: product,
				category: category,
				cart: req.session.cart,
				sessionId: req.session._id,
				anAdmin: req.session.anAdmin,
				pathName: "product",
				val: val,
				price: pricerange,
				color: color,
				tags: tags,
				sortby: sortby,
			});
		}
	} catch (e) {
		if (e) {
			console.log(e);
		}
	}
});

module.exports = router;
