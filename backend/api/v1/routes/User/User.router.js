const router = require("express").Router();
const { verifyAccessToken } = require("../../jwt/jwt_helper");
const { verifyLogin } = require("../../middlewares/User/auth.middleware");
const User_controller = require("../../controllers/User/User.controller.js");

router.get("/", verifyAccessToken, verifyLogin, User_controller.getUser);

const auth_router = require("./auth.router");
router.use("/auth", auth_router);

const Cart_router = require("./Cart/Cart.router");
router.use("/Cart", Cart_router);

const Coupon_router = require("./Coupon/Coupon.router");
router.use("/Coupon", Coupon_router);

const Order_router = require("./Order/Order.router");
router.use("/Order", Order_router);

const Product_router = require("./Product/Product.router");
router.use("/Product", Product_router);

module.exports = router;
