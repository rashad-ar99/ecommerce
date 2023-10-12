const axios = require("axios");

module.exports = {
	listCoupons: async (req, res, next) => {
		try {
			const Coupons = await axios.get(`${process.env.DB_HOST}/Coupons?UserID=${res.locals.User.id}&Active=true`);

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
