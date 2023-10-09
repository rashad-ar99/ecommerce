const createError = require("http-errors");
const bcrypt = require("bcrypt");
// const User_validation = require("../../validations/User/User.validation");

module.exports = {
	getUser: async (req, res, next) => {
		try {
			res.json({
				status: "success",
				data: {
					User: {
						UUID: res.locals.User.UUID,
						FirstName: res.locals.User.FirstName,
						LastName: res.locals.User.LastName,
						Email: res.locals.User.Email,
						EmailVerified: res.locals.User.EmailVerified,
						Phone: res.locals.User.Phone,
						PhoneVerified: res.locals.User.PhoneVerified,
						PasswordUpdatedAt: res.locals.User.PasswordUpdatedAt,
						MFAEnabled: res.locals.User.MFAEnabled,
						MFAMethod: res.locals.User.MFAMethod,
						PIN: res.locals.User.PIN,
						Address: res.locals.User.Address,
						ImageURL: res.locals.User.ImageURL,
						CreatedAt: res.locals.User.CreatedAt,
						UpdatedAt: res.locals.User.UpdatedAt,
					},
				},
			});
		} catch (error) {
			next(error);
		}
	},
};
