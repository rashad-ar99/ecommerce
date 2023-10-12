const axios = require("axios");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");

module.exports = {
	listOrders: async (req, res, next) => {
		try {
			const Orders = await axios.get(`${process.env.DB_HOST}/orders/`);

			res.json({
				status: "success",
				data: {
					Orders: Orders.data,
				},
			});
		} catch (error) {
			next(error);
		}
	},
	getOrder: async (req, res, next) => {
		try {
			const Orders = await axios.get(`${process.env.DB_HOST}/Orders/${req.params.OrderUUID}`);

			res.json({
				status: "success",
				data: {
					Orders: Orders.data,
				},
			});
		} catch (error) {
			next(error);
		}
	},
};
