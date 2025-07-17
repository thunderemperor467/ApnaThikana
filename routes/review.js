const express = require("express");
const router = express.Router({ mergeParams: true});
const Listing = require("../models/listing.js")
const Review = require("../models/review.js");                                   //Review schema/DB
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");  
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js")


// Review Route
//Adding this in listing/:id 
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.PostReview));


// Review delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));


module.exports = router;