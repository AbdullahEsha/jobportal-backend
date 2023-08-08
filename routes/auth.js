const express = require("express");
const router = express.Router();

const authUser = require("../middlewares/auth");

router.get("/user/:email", authUser.verifyUser);

module.exports = router;
