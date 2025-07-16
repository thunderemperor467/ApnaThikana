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



// const methodOverride = require("method-override");
app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));   //FOR PARSING DATA
app.use(methodOverride("_method"));  
app.engine("ejs", ejsMate);


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
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);



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