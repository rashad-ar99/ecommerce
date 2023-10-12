const Joi = require("joi");

module.exports = {
	register: Joi.object({
		Email: Joi.string().email().lowercase().required(),
		Password: Joi.string().min(8).required(),
		AdminCode: Joi.string().required(),
	}),
	login: Joi.object({
		Email: Joi.string().email().lowercase().required(),
		Password: Joi.string().allow(null, "").required(),
		Admin: Joi.boolean(),
	}),
	refreshToken: Joi.object({
		JWTRefreshToken: Joi.string().required(),
	}),
};
