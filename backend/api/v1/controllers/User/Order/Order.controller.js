const axios = require("axios");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");

module.exports = {
	listOrders: async (req, res, next) => {
		try {
			const Orders = await axios.get(`${process.env.DB_HOST}/orders?UserID=${res.locals.User.id}`);

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
	addOrder: async (req, res, next) => {
		try {
			const User = await axios.get(`${process.env.DB_HOST}/users?Email=${res.locals.User.Email}`);

			if (User.data.length === 0) throw createError.NotFound("User does not exist");

			const Order = await axios.post(`${process.env.DB_HOST}/orders`, {
				id: uuidv4(),
				UserID: res.locals.User.id,
				Cart: req.body.Cart,
				discount: req.body.discount,
				orderTotal: req.body.orderTotal,
				discountTotal: req.body.discountTotal,
			});

			req.body.Cart.productItems.map(async (productItem) => {
				const { data: product } = await axios.get(`${process.env.DB_HOST}/products/${productItem.id}`);

				product.quantityOrdered = product.quantityOrdered + productItem.quantity;

				await axios.patch(`${process.env.DB_HOST}/products/${productItem.id}`, product);
			});

			await axios.patch(`${process.env.DB_HOST}/carts/${req.body.Cart.id}`, {
				productItems: [],
				quantity: 0,
			});

			if (req.body.couponID) {
				const { data: coupon } = await axios.get(`${process.env.DB_HOST}/coupons/${req.body.couponID}`);

				if (!coupon) throw createError.NotFound("Invalid coupon");

				await axios.patch(`${process.env.DB_HOST}/coupons/${coupon.id}`, {
					Active: false,
				});
			}

			res.json({
				status: "success",
				data: {
					Order: Order.data,
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
