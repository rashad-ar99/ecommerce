const axios = require("axios");
const createError = require("http-errors");

module.exports = {
	addtoCart: async (req, res, next) => {
		try {
			const getCart = await axios.get(`${process.env.DB_HOST}/carts?UserID=${res.locals.User.id}`);
			const Cart = getCart.data[0];

			const productIndex = Cart.productItems.findIndex((productItem) => {
				return productItem.id === req.body.product.id;
			});

			const { id, name, actual_price, offer_price, image_link, description } = req.body.product;

			if (productIndex === -1) Cart.productItems.push({ id, name, actual_price, offer_price, image_link, description, quantity: 1 });
			else Cart.productItems[productIndex].quantity++;

			Cart.quantity++;

			await axios.patch(`${process.env.DB_HOST}/carts/${Cart.id}`, Cart);

			res.json({
				status: "success",
				data: {
					Cart,
				},
			});
		} catch (error) {
			next(error);
		}
	},
	removefromCart: async (req, res, next) => {
		try {
			const getCart = await axios.get(`${process.env.DB_HOST}/carts?UserID=${res.locals.User.id}`);
			const Cart = getCart.data[0];

			const productIndex = Cart.productItems.findIndex((productItem) => {
				return productItem.id === req.body.product.id;
			});

			if (productIndex === -1) throw createError.NotFound("Cart item does not exist");

			if (Cart.productItems[productIndex].quantity === 1) Cart.productItems.splice(productIndex, 1);
			else Cart.productItems[productIndex].quantity--;

			Cart.quantity--;

			await axios.patch(`${process.env.DB_HOST}/carts/${Cart.id}`, Cart);

			res.json({
				status: "success",
				data: {
					Cart,
				},
			});
		} catch (error) {
			next(error);
		}
	},
	getCart: async (req, res, next) => {
		try {
			const getCart = await axios.get(`${process.env.DB_HOST}/carts?UserID=${res.locals.User.id}`);
			const Cart = getCart.data[0];

			res.json({
				status: "success",
				data: {
					Cart: Cart,
				},
			});
		} catch (error) {
			next(error);
		}
	},
	getCartProduct: async (req, res, next) => {
		try {
			const getCart = await axios.get(`${process.env.DB_HOST}/carts?UserID=${res.locals.User.id}`);
			const Cart = getCart.data[0];

			const product = Cart.productItems.find((productItem) => {
				return productItem.id === req.params.ProductUUID;
			});

			res.json({
				status: "success",
				data: {
					product,
				},
			});
		} catch (error) {
			next(error);
		}
	},
};
