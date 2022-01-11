const { User } = require("../models/user");

module.exports = async (req, res, next) => {
	if (req.session.anAdmin) {
		next();
	} else {
		next();
		// res.send('This page is only accessible after you login as admin!!!')
	}
};
