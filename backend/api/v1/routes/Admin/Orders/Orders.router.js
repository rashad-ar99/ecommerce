const router = require("express").Router();
const { verifyAccessToken } = require("../../../jwt/jwt_helper");
const { verifyLogin } = require("../../../middlewares/Admin/auth.middleware");
const Orders_controller = require("../../../controllers/Admin/Orders/Orders.controller");

router.get("/", verifyAccessToken, verifyLogin, Orders_controller.listOrders);
router.get("/:OrderUUID", verifyAccessToken, verifyLogin, Orders_controller.getOrder);

module.exports = router;
