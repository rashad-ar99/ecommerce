const router = require("express").Router();
const { verifyAccessToken } = require("../../../jwt/jwt_helper");
const { verifyLogin } = require("../../../middlewares/Admin/auth.middleware");
const User_controller = require("../../../controllers/Admin/Users/User.controller");

router.get("/", verifyAccessToken, verifyLogin, User_controller.listUsers);
router.get("/:UserUUID", verifyAccessToken, verifyLogin, User_controller.getUser);

module.exports = router;
