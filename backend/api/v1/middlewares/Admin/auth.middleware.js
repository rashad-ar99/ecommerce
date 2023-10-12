const { default: axios } = require("axios");
const createError = require("http-errors");

module.exports = {
	verifyLogin: async (req, res, next) => {
		try {
			if (!req.payload.aud) throw createError.BadRequest("jwt invalid");

			const user = await axios.get(`${process.env.DB_HOST}/users/${req.payload.aud}`);

			res.locals.User = { id: user.data.id, Email: user.data.Email };

			if (!res.locals.User) throw createError.Unauthorized("User not found or unavailable");
		} catch (error) {
			next(error);
		}
		next();
	},
};
