const router = require("express").Router();
const { verifyAccessToken } = require("../../../jwt/jwt_helper");
const { verifyLogin } = require("../../../middlewares/User/auth.middleware");
const Cart_controller = require("../../../controllers/User/Cart/Cart.controller");

router.patch("/add", verifyAccessToken, verifyLogin, Cart_controller.addtoCart);
router.patch("/remove", verifyAccessToken, verifyLogin, Cart_controller.removefromCart);
router.get("/", verifyAccessToken, verifyLogin, Cart_controller.getCart);
router.get("/Product/:ProductUUID", verifyAccessToken, verifyLogin, Cart_controller.getCartProduct);

module.exports = router;
