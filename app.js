const express = require("express");
const app = express();
const mongoose = require("mongoose");  //DB REQUIRE
const ejs = require("ejs");  //EJS 
const path = require("path"); //EJS PATH
const Listing = require('./models/listing.js');  //Connect DB in Models
const methodOverride = require("method-override");  //PUT method override    
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema} = require("./schema.js");

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

//Testing Page
/*
app.get("/testListing", async (req, res)=>{
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the Beach",
        image: "",
        price: 5500,
        location: "Lokhandwala, Mumbai",
        country: "India",
    });

    await sampleListing.save()
    .then((res)=>{
        console.log(res);
    })
    .catch((err)=>{
        console.log(err);
    });
    console.log("sample was saved");
    res.send("Succesfull testing");
})
*/

//Index route
app.get("/listings", wrapAsync(async(req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
})
);


//Create Route: 
//New and Create and read route 
app.get("/listings/new", wrapAsync(async(req,res)=>{
    res.render("./listings/new.ejs")
})
);

app.post("/listings",wrapAsync(async(req, res, next)=>{
    let result = listingSchema.validate(req.body);
    if(result.err){
        throw new ExpressError(400, result.error)
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})
);



//UPDATE:
//EDIT AND UPDATE ROUTE
app.get("/listings/:id/edit", wrapAsync(async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})
);

app.put("/listings/:id", wrapAsync(async(req,res)=>{
    if(!req.body.listings){
        throw new ExpressError(400, "Send valid data for listing")
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})
);



//Show Route
app.get("/listings/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", {listing})
})
);

//DELETE ROUTE
app.delete("/listings/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})
);


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