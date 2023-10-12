const router = require("express").Router();
const { verifyAccessToken } = require("../../../jwt/jwt_helper");
const { verifyLogin } = require("../../../middlewares/User/auth.middleware");
const Coupon_controller = require("../../../controllers/User/Coupon/Coupon.controller");

router.get("/", verifyAccessToken, verifyLogin, Coupon_controller.listCoupons);
router.get("/:CouponUUID", verifyAccessToken, verifyLogin, Coupon_controller.getCoupon);

module.exports = router;
