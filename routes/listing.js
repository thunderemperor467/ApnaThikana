const express = require("express");
const router = express.Router();
const Listing = require('../models/listing.js');  //Connect DB in Models
const wrapAsync = require("../utils/wrapAsync.js")   // for Error handling
const ExpressError = require("../utils/ExpressError.js")   //Error handling file
const {listingSchema} = require("../schema.js");   //for lisitng validations
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const user = require("../routes/user.js");
const listingController = require("../controllers/listings.js")



//Index route
router.get("/", wrapAsync(listingController.index)
);


//Create Route: 
//New and Create and read route 
router.get("/new", isLoggedIn, wrapAsync(listingController.new)
);

router.post("/", wrapAsync(listingController.newpost)
);



//Show Route
router.get("/:id", wrapAsync(listingController.show)
);


//UPDATE:
//EDIT AND UPDATE ROUTE
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.edit)
);

router.put("/:id",isLoggedIn, isOwner, validateListing,  wrapAsync(listingController.updatePost)
);

//DELETE ROUTE
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.delete)
);


module.exports = router;
