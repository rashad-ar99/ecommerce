const axios = require("axios");
const createError = require("http-errors");

module.exports = {
	listUsers: async (req, res, next) => {
		try {
			const { data: UserData } = await axios.get(`${process.env.DB_HOST}/Users?Admin=false`);

			const usersWithOrders = await Promise.all(
				UserData.map(async (User) => {
					const { data: OrderData } = await axios.get(`${process.env.DB_HOST}/Orders?UserID=${User.id}`);
					return { ...User, orders: OrderData.length };
				})
			);

			res.json({
				status: "success",
				data: {
					Users: usersWithOrders,
				},
			});
		} catch (error) {
			next(error);
		}
	},
	getUser: async (req, res, next) => {
		try {
			const Users = await axios.get(`${process.env.DB_HOST}/Users/${req.params.UserUUID}`);

			res.json({
				status: "success",
				data: {
					Users: Users.data,
				},
			});
		} catch (error) {
			next(error);
		}
	},
};
