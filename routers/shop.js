const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");
const { Contact } = require("../models/contact");
const { Store } = require("../models/store");
const { User } = require("../models/user");
const { Order } = require("../models/order");
const { OrderDetail } = require("../models/orderDetail");
const mongoose = require("mongoose");
const multer = require("multer");
const { Category } = require("../models/category");
const apiKey = process.env.API_KEY;

router.get(`/`, async (req, res) => {
	const product = await Product.find().limit(8);
	const category = await Category.find().select("name");

	res.render("index", {
		product: product,
		category: category,
		cart: req.session.cart,
		sessionId: req.session._id,
		anAdmin: req.session.anAdmin,
	});
});

router.get(`/blog`, async (req, res) => {
	const category = await Category.find().select("name");

	res.render("blog", {
		cart: req.session.cart,
		sessionId: req.session._id,
		anAdmin: req.session.anAdmin,
		category: category,
	});
});

router.get(`/blogdetail`, async (req, res) => {
	const category = await Category.find().select("name");

	res.render("blogdetail", {
		cart: req.session.cart,
		sessionId: req.session._id,
		anAdmin: req.session.anAdmin,
		category: category,
	});
});

router.get(`/about`, async (req, res) => {
	const category = await Category.find().select("name");

	res.render("about", {
		cart: req.session.cart,
		sessionId: req.session._id,
		anAdmin: req.session.anAdmin,
		category: category,
	});
});

router.get(`/contact`, async (req, res) => {
	const category = await Category.find().select("name");

	res.render("contact", {
		cart: req.session.cart,
		sessionId: req.session._id,
		anAdmin: req.session.anAdmin,
		category: category,
	});
});

router.post(`/contact`, async (req, res) => {
	let contactMsg = new Contact({
		username: req.body.username,
		email: req.body.email,
		subject: req.body.subject,
		message: req.body.message,
	});

	contactMsg = await contactMsg.save();

	if (!contactMsg) res.status(500).send("The contact message was not saved");

	res.redirect("/contact");
});

router.get(`/product`, async (req, res) => {
	const product = await Product.find();

	const category = await Category.find().select("name");

	res.render("product", {
		product: product,
		category: category,
		cart: req.session.cart,
		sessionId: req.session._id,
		anAdmin: req.session.anAdmin,
		pathName: "product",
		val: '',
		price: '',
		color: '',
		tags: '',
		sortby: ''
	});
});

router.get(`/:name`, async (req, res, next) => {
	const pathName = req.params.name;
	const categoryId = await Category.findOne({ name: pathName });
	if (!categoryId) {
		next();
	} else {
		const category = await Category.find().select("name");
		const product = await Product.find({ category: categoryId._id });

		res.render("product", {
			product: product,
			category: category,
			cart: req.session.cart,
			sessionId: req.session._id,
			anAdmin: req.session.anAdmin,
			pathName: pathName,
			val: '',
			price: '',
			color: '',
			tags: '',
			sortby: ''
		});
	}
});

router.get(`/productdetail`, async (req, res) => {
	const product = await Product.findById(req.query.id).populate("category");
	const category = await Category.find().select("name");

	res.render("productdetail", {
		product: product,
		cart: req.session.cart,
		sessionId: req.session._id,
		anAdmin: req.session.anAdmin,
		category: category,
	});
});

router.get(`/carthandler`, async (req, res) => {
	const cart = {
		id: req.query.id,
		name: req.query.name,
		price: req.query.price,
		image: req.query.image,
		quantity: req.query.quantity,
	};

	if (req.session.cart) {
		if (req.session.cart.find((item) => item.name === req.query.name)) {
			console.log("Item is already saved...");
		} else {
			req.session.cart.push(cart);
		}
	} else {
		req.session.cart = [];
		req.session.cart.push(cart);
	}

	res.redirect("/product");
});

router.get(`/cart`, async (req, res) => {
	const category = await Category.find().select("name");

	res.render("cart", {
		cart: req.session.cart,
		sessionId: req.session._id,
		anAdmin: req.session.anAdmin,
		category: category,
	});
});

router.post(`/removecart`, async (req, res) => {
	const savedCart = req.session.cart;
	const item = savedCart.find((item) => item.name === req.body.name);
	req.session.cart = savedCart.filter((value) => value !== item);

	res.redirect("cart");
});

router.post(`/updatecart`, async (req, res) => {
	req.session.cart.forEach((item) => {
		if (item.id === req.body.id) {
			item.quantity = req.body.quantity;
		}
	});
	req.session.save();

	res.redirect("cart");
});

router.get(`/login`, async (req, res) => {
	const category = await Category.find().select("name");

	res.render("login", {
		cart: req.session.cart,
		sessionId: req.session._id,
		anAdmin: req.session.anAdmin,
		category: category,
	});
});

router.get(`/logout`, async (req, res) => {
	req.session.destroy();
	res.redirect("/");
});

router.post("/signup", async (req, res) => {
	let user = new User({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		phonenumber: req.body.phonenumber,
	});

	user = await user.save();

	if (!user) res.status(400).send("The data cannot be saved");

	res.redirect("/login");
});

router.post("/signin", async (req, res) => {
	let user = await User.findOne({ email: req.body.email });

	if (!user) return res.status(400).send("This user is not Registered");

	if (user && user.password === req.body.password) {
		req.session._id = user._id;
		req.session.anAdmin = user.isAdmin;
		return req.session.save((err) => {
			res.redirect("/");
		});
	} else {
		res.redirect("/login");
	}
});

router.get("/checkout", async (req, res) => {
	// if (!req.session._id) {
	//     res.redirect('/login')
	// } else {
	const category = await Category.find().select("name");

	res.render("checkout", {
		cart: req.session.cart,
		sessionId: req.session._id,
		anAdmin: req.session.anAdmin,
		category: category,
		apiKey: apiKey
	});
	// }
});

router.post("/orderhandler", async (req, res) => {
	const orderItemsIds = Promise.all(
		req.session.cart.map(async (savedCart) => {
			let orderDetail = new OrderDetail({
				quantity: savedCart.quantity,
				product: savedCart.id,
			});

			orderDetail = await orderDetail.save();

			return orderDetail._id;
		})
	);

	const orderItemsIdsResolve = await orderItemsIds;

	let order = new Order({
		orderItems: orderItemsIdsResolve,
		userId: req.body.userId,
		address: req.body.address,
		state_country: req.body.state_country,
		city_zipcode: req.body.city_zipcode,
		phone: req.body.phone,
		total: req.body.total,
	});

	order = await order.save();

	if (!order) return res.status(400).send("The order was not completed");

	res.redirect("/");
});

router.get("/aggregation", (req, res) => {
	res.render("searchmailbox");
});

router.get("/ssss", async (req, res) => {
	let store = await Store.find();

	res.send(store);
});

router.post("/ssss", async (req, res) => {
	let arr = req.body.keyword.split(",");
	let array = req.body.coordinate.split(",");
	let store = new Store({
		address: {
			name: req.body.name,
			state: req.body.state,
			keyword: arr,
			country: req.body.country,
			location: {
				coordinate: array,
			},
		},
		// username: req.body.username,
		// email: req.body.email,
		// password: req.body.password,
		// phonenumber: req.body.phonenumber
	});

	store = await store.save();

	if (!store) res.status(400).send("The data cannot be saved");

	res.send(store);
	// res.redirect('/login')
});

module.exports = router;
