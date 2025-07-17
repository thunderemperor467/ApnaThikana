const express = require("express");
const router = express.Router();
const Listing = require('../models/listing.js');  //Connect DB in Models
const wrapAsync = require("../utils/wrapAsync.js")   // for Error handling
const ExpressError = require("../utils/ExpressError.js")   //Error handling file
const {listingSchema} = require("../schema.js");   //for lisitng validations
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const user = require("../routes/user.js");


//Index route
router.get("/", wrapAsync(async(req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
})
);


//Create Route: 
//New and Create and read route 
router.get("/new", isLoggedIn, wrapAsync(async(req,res)=>{
    res.render("./listings/new.ejs")
})
);

router.post("/", wrapAsync(async(req, res, next)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
})
);



//Show Route
router.get("/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");    //we do populate to show all data in form of id's etc
    if(!listing){
        req.flash("error", "Invalid Request")
        return res.redirect("/listings")
    }
    // console.log(listing);
    res.render("./listings/show.ejs", {listing})
})
);


//UPDATE:
//EDIT AND UPDATE ROUTE
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})
);

router.put("/:id",isLoggedIn, isOwner, validateListing,  wrapAsync(async(req,res)=>{  //use valaidateListning for the error handling on server side by Joi
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
})
);

//DELETE ROUTE
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
})
);


module.exports = router;
