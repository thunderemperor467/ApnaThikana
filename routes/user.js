const express = require("express");
const router = express.Router({ mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
// const {userSchema} = require("../schema.js"); 
const User = require("../models/user.js") 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const {saveRedirectUrl} = require("../middleware.js")



router.get("/signup",(Req,res)=>{
    res.render("./users/signup.ejs");
})


router.post("/signup", async(req, res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User ({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            };
            req.flash("success", "Welcome to ApnaThikana");
            res.redirect("./listings");
        });  
    }
    catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    };
    
})

// LOGIN
router.get("/login",(req, res)=>{
    res.render("./users/login.ejs");
});

router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    }), 
    async(req, res) => {
        req.flash("Welcome to ApnaThikana! You are logged in!")
        let redirectUrl = res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl);
        
})


// LOGOUT
router.get("/logout",(req, res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
});





module.exports = router;