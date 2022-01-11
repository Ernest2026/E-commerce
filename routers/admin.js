const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");
const { Product } = require("../models/product");
const { User } = require("../models/user");
const { Contact } = require("../models/contact");
const { Order } = require("../models/order");
const mongoose = require("mongoose");
const multer = require("multer");
const isAuth = require("../build/is-auth");
const fileHelper = require("../build/file");

const fileTypeMap = {
	"image/png": "png",
	"image/jpg": "jpg",
	"image/jpeg": "jpeg",
};

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const isValid = fileTypeMap[file.mimetype];
		let uploadError = new Error("Invalid image type");

		if (isValid) {
			uploadError = null;
		}
		cb(uploadError, "public/uploads");
	},
	filename: function (req, file, cb) {
		const fileName = file.originalname.replaceAll(" ", "-").split(".");
		fileName.pop();
		const extension = fileTypeMap[file.mimetype];
		cb(null, `${fileName}-${Date.now()}.${extension}`);
	},
});

const upload = multer({ storage: storage });

router.get(`/`, isAuth, async (req, res) => {
	const order = await Order.countDocuments();
	const product = await Product.countDocuments();
	const user = await User.countDocuments();
	const contact = await Contact.countDocuments();

	res.render("admin/index", {
		orders: order,
		product: product,
		user: user,
		contact: contact,
	});
});

router.get(`/category`, isAuth, async (req, res) => {
	res.render("admin/category");
});

router.post(`/category`, isAuth, async (req, res) => {
	let category = new Category({
		name: req.body.category,
	});

	category = await category.save();

	if (!category)
		res.status(500).send("This category was not sent to database...");

	res.redirect("/admin/category");
});

router.get(`/addproduct`, isAuth, async (req, res) => {
	const category = await Category.find().select("name");

	res.render("admin/addproduct", { category: category });
});

router.post(`/addproduct`, isAuth, upload.single("image"), async (req, res) => {
	const fileName = req.file.filename;
	const basePath = `${req.protocol}://${req.get("host")}/uploads/`;

	let product = new Product({
		name: req.body.name,
		price: req.body.price,
		image: `${basePath}${fileName}`,
		description: req.body.description,
		category: req.body.category,
	});

	product = await product.save();

	if (!product)
		res.status(500).send("This product was not sent to database...");

	res.redirect("/admin/addproduct");
});

router.get("/product", isAuth, async (req, res) => {
	const product = await Product.find();

	res.render("admin/product", {
		product: product,
	});
});

router.get("/productdetails", isAuth, async (req, res) => {
	const product = await Product.findOne({ _id: req.query.id });

	res.render("admin/productdetails", {
		product: product,
	});
});

router.get("/updateproduct", isAuth, async (req, res) => {
	const product = await Product.findOne({ _id: req.query.id }).populate(
		"category"
	);
	const category = await Category.find().select("name");

	res.render("admin/updateproduct", {
		category: category,
		product: product,
	});
});

router.post(
	"/updateproduct/:id",
	isAuth,
	upload.single("image"),
	async (req, res) => {
		if (!mongoose.isValidObjectId(req.params.id)) {
			return res.status(400).send("Invalid product id");
		}

		const file = req.file;
		let imagePath;

		if (file) {
			const fileName = req.file.filename;
			const basePath = `${req.protocol}://${req.get("host")}/uploads/`;
			imagePath = `${basePath}${fileName}`;
		} else {
			const product = await Product.findById(req.params.id);
			imagePath = product.image;
		}

		const updateProduct = await Product.findByIdAndUpdate(
			req.params.id,
			{
				name: req.body.name,
				price: req.body.price,
				image: imagePath,
				description: req.body.description,
				category: req.body.category,
				updated_at: Date.now(),
			},
			{
				new: true,
			}
		);

		res.redirect("/admin/viewproduct");
	}
);

router.get("/deleteproduct/:id", isAuth, async (req, res) => {
	try {
		product = await Product.findByIdAndRemove(req.params.id);

		if (product) {
			fileHelper.deleteFile(`public/${product.image}`);
			return res.status(200).redirect("/admin/viewproduct");
		} else {
			return res
				.status(404)
				.json({ success: false, message: "The product not found" });
		}
	} catch (err) {
		return res.status(400).json({ success: false, error: err });
	}
});

router.get(`/mailbox`, isAuth, async (req, res) => {
	const contact = await Contact.find();

	res.render("admin/mailbox", {
		messages: contact,
	});
});

router.get(`/readmail`, isAuth, async (req, res) => {
	const message = await Contact.findOne({ _id: req.query.id });
	const findPath = req.query.path;
	const fileText = req.query.text;
	// message.filePath

	res.render("admin/readmail", {
		message: message,
	});
});

module.exports = router;
