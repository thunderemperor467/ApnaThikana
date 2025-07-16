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
const listings = require("./routes/listing.js");                                //Listing route
const reviews = require("./routes/review.js")                                   //Review Route
// Express session
const session = require("express-session");
// flash
const flash = require("connect-flash")


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
// this is for saving the success flash in locals
app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

//Database Testing
main()
    .then((res) => {
        console.log("connection succesful");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/apnathikana');
}



// ADDING LISTING ROUTE
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);



// BASIC END POINT OF ALL ERRORS
app.use((err, req, res, next)=>{
    let {statusCode = 500, message = "Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.render("./listings/error.ejs",{message});
})

//Basic Api
app.get("/", (req, res)=>{
    res.send("root is working");
})
//Server Testing
app.listen(8080,(Req, res)=>{
    console.log("Server Working");
})

/*
                                              Express Session: A type of middleware
 This modify http stateless to stateful.. so that http also track user data from diff pages


npm i express-session
const session = require("express-session");

# Basic syntax::
app.use(session({
    secret: "mysupersecretstring";      isse site pr ni dikhegi cookie ka naam... kch anonymous name aega
    resave: false,                      isse baar baar save ni hoga
    saveUninitialized: true,
    }));

                OR
const sessionOptions = {
    secret: "mysupersecretstring";      isse site pr ni dikhegi cookie ka naam... kch anonymous name aega
    resave: false,                      isse baar baar save ni hoga
    saveUninitialized: true,
    cookie:{
        expires: Date.now() +1000*60*60*24*3,
        maxAge: 1000*60*60*24*3,
        httpOnly: true
    },
    };

app.use(session(sessionOptions));


                                        # Connect flash
                            to flash something if we add/delete etc
npm i connect-flash
const flash = require("connect-flash");
req.flash("key", "message");
example:
req.flash("success", "user registered successfulyl")



                                                #res.local
if we want to use some variables and want to render it in res.render so instead of using that
we use res.local


example:
app.get("/register",(req,res)=>{
    let { name = "anonymous"} = req.query;
    req.session.name = name;
    req.flash("success", "user registered successfully!");
    res.redirect("/hello");
    })
app.get("/hello",(Req,res)=>{
    res.local.messages = req.flash("success");
    res.render("page.ejs", {name: req.session.name});
    });

FLASH STEPS:
1st. app.js: 
app.use(flash());
// this is for saving the success flash in locals
app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    next();
})

2nd. listing.js
add it in post route
router.post("/", wrapAsync(async(req, res, next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
})
);

3rd. add it on the top of index.ejs page
<%= success %>
 

*/