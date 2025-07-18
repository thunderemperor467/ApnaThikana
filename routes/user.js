const express = require("express");
const router = express.Router({ mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
// const {userSchema} = require("../schema.js"); 
const User = require("../models/user.js") 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const {saveRedirectUrl} = require("../middleware.js")
const userController = require("../controllers/user.js")

// Sign up
router
    .route("/signup")
    .get(userController.signup)
    .post(userController.Postsignup);


// LOGIN
router.route("/login")
.get(userController.login)
.post(saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    }), 
    userController.PostLogin);


// LOGOUT
router.get("/logout", userController.logout);
module.exports = router;