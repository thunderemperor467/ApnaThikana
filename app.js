if(process.env.NODE_ENV !="production"){
require("dotenv").config();
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");                                             //DB REQUIRE
const ejs = require("ejs");                                                      //EJS 
const path = require("path");                                                    //EJS PATH
const Listing = require('./models/listing.js');                                  //Connect DB in Models
const methodOverride = require("method-override");                               //PUT method override    
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")                               // for Error handling
const ExpressError = require("./utils/ExpressError.js")                         //Error handling file
const {listingSchema, reviewSchema} = require("./schema.js");                   //for lisitng validations
const Review = require("./models/review.js");                                   //Review schema/DB
// ROUTES
const listingRouter = require("./routes/listing.js");                                //Listing route
const reviewRouter = require("./routes/review.js")                                   //Review Route
const userRouter = require("./routes/user.js")                                   //Review Route
const session = require("express-session");     //express-sessions
const flash = require("connect-flash")          //flash
// for Password Authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// MULTER- Parsing uploading image data
const multer = require("multer");
const upload = multer({dest: "uploads/"})



// const methodOverride = require("method-override");
app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));   //FOR PARSING DATA
app.use(methodOverride("_method"));  
app.engine("ejs", ejsMate);



// EXPRESS SESSION
const sessionOptions = {
    secret : "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{                       //LOGIN INFO EXPIRES IN 7 DAYS
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    },
};

app.use(session(sessionOptions));     //bcfore require reviews and listings routes
app.use(flash());

// PASSWORD
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate() ));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// this is for saving the success flash in locals
app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})



//Database Testing

const dbURL = process.env.ATLASDB_URL;

mongoose.connect(dbURL)
    .then(() => {
        console.log("✅ MongoDB Atlas connection successful");
    })
    .catch(err => {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    });


// ADDING LISTING ROUTE
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter)

// PASSWORD
app.get("/demouser", async(req, res)=>{
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta_student"
    });
    let registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser)
})


app.get("/signup", async(req, res)=>{

});
app.post("/signup",async(req,  res)=>{

});
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;  // Set the user globally for all views
    next();
});


// BASIC END POINT OF ALL ERRORS
app.use((err, req, res, next)=>{
    let {statusCode = 500, message = "Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.render("./listings/error.ejs",{message});
});

//Basic Api
// app.get("/", (req, res)=>{
//     res.send("root is working");
// });
//Server Testing
app.listen(8080,(Req, res)=>{
    console.log("Server Working");
});