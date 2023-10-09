const router = require("express").Router();
const { verifyAccessToken } = require("../../jwt/jwt_helper");
// const { verifyLogin } = require("../../middlewares/User/auth.middleware");
const User_controller = require("../../controllers/User/User.controller");

// const auth_router = require("./auth.router");
// router.use("/auth", auth_router);

module.exports = router;
