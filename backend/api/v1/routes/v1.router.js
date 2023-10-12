const router = require("express").Router();

const Admin_router = require("./Admin/Admin.router");
router.use("/Admin", Admin_router);

const User_router = require("./User/User.router");
router.use("/User", User_router);

module.exports = router;
