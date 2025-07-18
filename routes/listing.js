const express = require("express");
const router = express.Router();
const Listing = require('../models/listing.js');  //Connect DB in Models
const wrapAsync = require("../utils/wrapAsync.js")   // for Error handling
const ExpressError = require("../utils/ExpressError.js")   //Error handling file
const {listingSchema} = require("../schema.js");   //for lisitng validations
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const user = require("../routes/user.js");
const listingController = require("../controllers/listings.js")


router
    .route("/")
    //Index route
    .get(wrapAsync(listingController.index))  
    //Create new list  
    .post(isLoggedIn, validateListing, wrapAsync(listingController.newpost));

router
    .route("/:id")
    // show route
    .get( wrapAsync(listingController.show))
    // listing update
    .put(isLoggedIn, isOwner, validateListing,  wrapAsync(listingController.updatePost))
    // listing delete
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));


//Create Route: 
//New and Create and read route 
router.get("/new", isLoggedIn, wrapAsync(listingController.new)
);
//UPDATE:
//EDIT AND UPDATE ROUTE
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.edit)
);
module.exports = router;
