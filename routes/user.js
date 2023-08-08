const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");

router
  .route("/")
  .get(userController.getUserData)
  .post(userController.createUser);

router.route("/:id").get(userController.getUserById);
router.route("/login").post(userController.login);
router.route("/isLoggedIn").post(userController.isLoggedIn);

module.exports = router;
