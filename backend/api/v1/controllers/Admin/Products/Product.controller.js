const axios = require("axios");
const createError = require("http-errors");

module.exports = {
	listProducts: async (req, res, next) => {
		try {
			const Products = await axios.get(`${process.env.DB_HOST}/products`);

			res.json({
				status: "success",
				data: {
					Products: Products.data,
				},
			});
		} catch (error) {
			next(error);
		}
	},
	getProduct: async (req, res, next) => {
		try {
			const Products = await axios.get(`${process.env.DB_HOST}/products/${req.params.ProductUUID}`);

			res.json({
				status: "success",
				data: {
					Products: Products.data,
				},
			});
		} catch (error) {
			next(error);
		}
	},
};
