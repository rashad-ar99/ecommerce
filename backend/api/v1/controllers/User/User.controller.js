const createError = require("http-errors");
const bcrypt = require("bcrypt");

module.exports = {
	getUser: async (req, res, next) => {
		try {
			res.json({
				status: "success",
				data: {
					User: {
						id: res.locals.User.id,
						Email: res.locals.User.Email,
						Admin: res.locals.User.Admin,
					},
				},
			});
		} catch (error) {
			next(error);
		}
	},
};
