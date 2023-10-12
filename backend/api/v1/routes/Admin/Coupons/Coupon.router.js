const router = require("express").Router();
const { verifyAccessToken } = require("../../../jwt/jwt_helper");
const { verifyLogin } = require("../../../middlewares/Admin/auth.middleware");
const Coupon_controller = require("../../../controllers/Admin/Coupons/Coupon.controller");

router.get("/", verifyAccessToken, verifyLogin, Coupon_controller.listCoupons);
router.post("/", verifyAccessToken, verifyLogin, Coupon_controller.addCoupon);
router.get("/:CouponUUID", verifyAccessToken, verifyLogin, Coupon_controller.getCoupon);

module.exports = router;
