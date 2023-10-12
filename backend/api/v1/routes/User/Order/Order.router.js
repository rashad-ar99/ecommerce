const router = require("express").Router();
const { verifyAccessToken } = require("../../../jwt/jwt_helper");
const { verifyLogin } = require("../../../middlewares/User/auth.middleware");
const Order_controller = require("../../../controllers/User/Order/Order.controller");

router.get("/", verifyAccessToken, verifyLogin, Order_controller.listOrders);
router.post("/", verifyAccessToken, verifyLogin, Order_controller.addOrder);
router.get("/:OrderUUID", verifyAccessToken, verifyLogin, Order_controller.getOrder);

module.exports = router;
