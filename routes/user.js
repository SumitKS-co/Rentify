const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserController = require("../controllers/users.js");

router.get("/signup", UserController.renderSignup);

router.post("/signup", wrapAsync(UserController.signUp));

router.get("/login", wrapAsync(UserController.renderLoginForm));

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(UserController.Login)
);
// passport.authenticate() is used to check here wheter the same user existed already

router.get("/logout", UserController.logout);

module.exports = router;
