const createError = require("http-errors");
const crypto = require("crypto");
const axios = require("axios");
const bcrypt = require("bcrypt");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../../jwt/jwt_helper");
const auth_validation = require("../../validations/User/auth.validation");
const { v4: uuidv4 } = require("uuid");

module.exports = {
	register: async (req, res, next) => {
		try {
			const JoiResult = await auth_validation.register.validateAsync(req.body);
			const User = await axios.get(`${process.env.DB_HOST}/users?Email=${JoiResult.Email}`);

			if (User.data.length > 0) throw createError.Conflict("Email already exists");

			bcrypt.hash(JoiResult.Password, 10, async (err, hash) => {
				const newUser = await axios.post(`${process.env.DB_HOST}/users`, {
					id: uuidv4(),
					Email: JoiResult.Email,
					Password: hash,
					Admin: false,
				});

				await axios.post(`${process.env.DB_HOST}/carts`, {
					id: uuidv4(),
					UserID: newUser.data.id,
					productItems: [],
					quantity: 0,
				});
			});

			res.json({
				status: "success",
				data: null,
			});
		} catch (error) {
			next(error);
		}
	},
	login: async (req, res, next) => {
		try {
			const JoiResult = await auth_validation.login.validateAsync(req.body);

			const user = await axios.get(`${process.env.DB_HOST}/users?Email=${JoiResult.Email}`);
			const UserData = user.data[0];

			if (!UserData) throw createError.NotFound("Email not found");
			if (!(await bcrypt.compare(JoiResult.Password, UserData.Password))) throw createError.Unauthorized("Password incorrect");

			const { token: JWTRefreshToken, expiry: JWTRefreshTokenExpiresAt } = await signRefreshToken(UserData.id);

			await axios.post(`${process.env.DB_HOST}/sessions`, {
				id: uuidv4(),
				JWTRefreshToken,
				JWTRefreshTokenExpiresAt,
				UserID: UserData.id,
				IP: req.ip,
				UserAgent: req.get("user-agent"),
			});

			const { token: JWTAccessToken, expiry: JWTAccessTokenExpiresAt } = await signAccessToken(UserData.id);

			res.json({
				status: "success",
				data: {
					JWTAccessToken,
					JWTAccessTokenExpiresAt,
					JWTRefreshToken,
					JWTRefreshTokenExpiresAt,
					User: {
						id: UserData.id,
						Email: UserData.Email,
						Admin: UserData.Admin,
					},
				},
			});
		} catch (error) {
			next(error);
		}
	},
	refreshAccessToken: async (req, res, next) => {
		try {
			const JoiResult = await auth_validation.refreshToken.validateAsync(req.body);

			const session = await axios.get(`${process.env.DB_HOST}/sessions?JWTRefreshToken=${JoiResult.JWTRefreshToken}`);
			const UserSession = session.data[0];

			if (!UserSession) throw createError.NotFound("Session not found");
			if (UserSession.JWTRefreshTokenExpiresAt < new Date()) throw createError.Forbidden("Session expired");

			const UserID = await verifyRefreshToken(JoiResult.JWTRefreshToken);

			if (UserID !== UserSession.UserID) throw createError.Forbidden("Token incorrect");

			const { token: JWTAccessToken, expiry: JWTAccessTokenExpiresAt } = await signAccessToken(UserID);

			res.json({
				status: "success",
				data: {
					JWTAccessToken,
					JWTAccessTokenExpiresAt,
					JWTRefreshToken: UserSession.JWTRefreshToken,
					JWTRefreshTokenExpiresAt: UserSession.JWTRefreshTokenExpiresAt,
				},
			});
		} catch (error) {
			next(error);
		}
	},
	logout: async (req, res, next) => {
		try {
			const JoiResult = await auth_validation.refreshToken.validateAsync(req.body);

			const session = await axios.get(`${process.env.DB_HOST}/sessions?JWTRefreshToken=${JoiResult.JWTRefreshToken}`);
			const UserSession = session.data[0];

			if (!UserSession) throw createError.NotFound("Session not found");

			await axios.delete(`${process.env.DB_HOST}/sessions/${UserSession.id}`);

			res.json({
				status: "success",
				data: null,
			});
		} catch (error) {
			next(error);
		}
	},
};
