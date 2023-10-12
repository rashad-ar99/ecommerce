const router = require("express").Router();
const { verifyAccessToken } = require("../../jwt/jwt_helper");
const { verifyLogin } = require("../../middlewares/Admin/auth.middleware");
const Admin_controller = require("../../controllers/Admin/Admin.controller.js");

router.get("/", verifyAccessToken, verifyLogin, Admin_controller.getAdmin);

const auth_router = require("./auth.router");
router.use("/auth", auth_router);

const Coupon_router = require("./Coupons/Coupon.router");
router.use("/Coupons", Coupon_router);

const Orders_router = require("./Orders/Orders.router");
router.use("/Orders", Orders_router);

const Products_router = require("./Products/Products.router");
router.use("/Products", Products_router);

const Users_router = require("./Users/Users.router");
router.use("/Users", Users_router);

module.exports = router;
