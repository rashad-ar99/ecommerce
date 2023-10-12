const router = require("express").Router();
const { verifyAccessToken } = require("../../../jwt/jwt_helper");
const { verifyLogin } = require("../../../middlewares/User/auth.middleware");
const Product_controller = require("../../../controllers/User/Product/Product.controller");

router.get("/", verifyAccessToken, verifyLogin, Product_controller.listProducts);
router.get("/:ProductUUID", verifyAccessToken, verifyLogin, Product_controller.getProduct);

module.exports = router;
