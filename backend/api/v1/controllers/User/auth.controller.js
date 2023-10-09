const createError = require("http-errors");
const crypto = require("crypto");
const axios = require("axios");
const bcrypt = require("bcrypt");
const { signAccessToken, signRefreshToken } = require("../../jwt/jwt_helper");
const auth_validation = require("../../validations/User/auth.validation");
const { Users, UserSessions } = require("../../models");
const { uuid } = require("uuidv4");

async function generateEmailVerificationToken() {
	return crypto.randomInt(0, 1000000).toString().padStart(6, "0");
}

async function generateEmailVerificationTokenExpiresAt() {
	return new Date(new Date().getTime() + 60 * 60 * 1000);
}

module.exports = {
	register: async (req, res, next) => {
		try {
			const JoiResult = await auth_validation.register.validateAsync(req.body);

			if (
				await Users.findOne({
					where: {
						VendorUUID: res.locals.Vendor.UUID,
						Email: JoiResult.Email,
						DeletedAt: null,
					},
				})
			)
				throw createError.Conflict("Email already exists");

			const EmailVerificationToken = await generateEmailVerificationToken();

			const EmailVerificationTokenExpiresAt = await generateEmailVerificationTokenExpiresAt();

			bcrypt.hash(JoiResult.Password, 10, async (err, hash) => {
				await Users.create({
					Active: true,
					Email: JoiResult.Email,
					EmailVerificationToken,
					EmailVerificationTokenExpiresAt,
					EmailVerificationTokenAttemptsRemaining: 10,
					Password: hash,
					VendorUUID: res.locals.Vendor.UUID,
				});
			});

			res.json({
				status: "success",
				data: null,
			});

			if (res.locals.Vendor.CallbackURL_User_Auth_Register) {
				await axios
					.post(
						res.locals.Vendor.CallbackURL_User_Auth_Register,
						{
							Email: JoiResult.Email,
							EmailVerificationToken,
							EmailVerificationTokenExpiresAt,
							CallbackSentAt: new Date(),
							VendorUUID: res.locals.Vendor.UUID,
						},
						{ timeout: 15000 }
					)
					.catch((error) => {
						throw createError.BadGateway(error.message);
					});
			}
		} catch (error) {
			next(error);
		}
	},
	login: async (req, res, next) => {
		try {
			const JoiResult = await auth_validation.login.validateAsync(req.body);

			const User = await Users.findOne({
				where: {
					Email: JoiResult.Email,
					DeletedAt: null,
					VendorUUID: res.locals.Vendor.UUID,
				},
			});
			if (!User) throw createError.NotFound("Email not found");
			if (!(await bcrypt.compare(JoiResult.Password, User.Password))) throw createError.Unauthorized("Password incorrect");
			if (!User.Active) throw createError.Unauthorized("Account deactivated");
			if (!User.EmailVerified) throw createError.Unauthorized("Email not verified");

			const { token: JWTRefreshToken, expiry: JWTRefreshTokenExpiresAt } = await signRefreshToken(User.UUID);

			const UserSession = await UserSessions.create({
				JWTRefreshToken,
				JWTRefreshTokenExpiresAt,
				UserUUID: User.UUID,
				IP: req.ip,
				UserAgent: req.get("user-agent"),
			});

			const { token: JWTAccessToken, expiry: JWTAccessTokenExpiresAt } = await signAccessToken(User.UUID);

			res.json({
				status: "success",
				data: {
					UserSessionUUID: UserSession.UUID,
					JWTAccessToken,
					JWTAccessTokenExpiresAt,
					JWTRefreshToken,
					JWTRefreshTokenExpiresAt,
					User: {
						UUID: User.UUID,
						FirstName: User.FirstName,
						LastName: User.LastName,
						Email: User.Email,
						EmailVerified: User.EmailVerified,
						Phone: User.Phone,
						PhoneVerified: User.PhoneVerified,
						PasswordUpdatedAt: User.PasswordUpdatedAt,
						MFAEnabled: User.MFAEnabled,
						MFAMethod: User.MFAMethod,
						PIN: User.PIN,
						Address: User.Address,
						ImageURL: User.ImageURL,
						CreatedAt: User.CreatedAt,
						UpdatedAt: User.UpdatedAt,
					},
				},
			});
		} catch (error) {
			next(error);
		}
	},
	logout: async (req, res, next) => {
		try {
			const JoiResult = await auth_validation.refreshToken.validateAsync(req.body);

			const UserSession = await UserSessions.findOne({ where: { JWTRefreshToken: JoiResult.JWTRefreshToken } });
			if (!UserSession) throw createError.NotFound("Session not found");
			if (UserSession.DeletedAt) throw createError.Forbidden("Session already deleted");

			await UserSessions.destroy({
				where: {
					JWTRefreshToken: JoiResult.JWTRefreshToken,
					DeletedAt: null,
				},
			});

			res.json({
				status: "success",
				data: null,
			});
		} catch (error) {
			next(error);
		}
	},
};
