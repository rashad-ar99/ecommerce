const axios = require("axios");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");

module.exports = {
	listCoupons: async (req, res, next) => {
		try {
			const Coupons = await axios.get(`${process.env.DB_HOST}/Coupons/`);

			res.json({
				status: "success",
				data: {
					Coupons: Coupons.data,
				},
			});
		} catch (error) {
			next(error);
		}
	},
	addCoupon: async (req, res, next) => {
		try {
			function generateRandomString(length) {
				const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
				let result = "";

				for (let i = 0; i < length; i++) {
					const randomIndex = Math.floor(Math.random() * characters.length);
					result += characters.charAt(randomIndex);
				}

				return result;
			}

			const { data: Coupon } = await axios.post(`${process.env.DB_HOST}/coupons`, {
				id: uuidv4(),
				UserID: req.body.id,
				Code: generateRandomString(10),
				Active: true,
			});

			res.json({
				status: "success",
				data: {
					Coupon: Coupon,
				},
			});
		} catch (error) {
			next(error);
		}
	},
	getCoupon: async (req, res, next) => {
		try {
			const Coupons = await axios.get(`${process.env.DB_HOST}/Coupons/${req.params.CouponUUID}`);

			res.json({
				status: "success",
				data: {
					Coupons: Coupons.data,
				},
			});
		} catch (error) {
			next(error);
		}
	},
};
