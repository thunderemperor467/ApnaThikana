const Listing = require("./models/listing")
const {reviewSchema} = require("./schema");  
const Review = require("./models/review"); 
//Authentication of the user: login 
module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.path, "..", req.orginalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    };
    next()
}


module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


//checking owner and currUser: for edit and update and delete
module.exports.isOwner = async(req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validateListing = (req, res, next)=>{
        // Validate listing middleware
    
        let {error} = listingSchema.validate(req.body);
        if(error){ 
            let errMsg = error.details.map((el)=> el.message).join(".");
            throw new ExpressError(400, errMsg);
        }
        else{
            next();
        }
    
}; 

//Review validation
module.exports.validateReview = (req, res, next) =>{
    // Validate Review
    
        let {error} = reviewSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=> el.message).join(".");
            throw new ExpressError(400, errMsg);
        }
        else{
            next();
        }
    
};


module.exports.isReviewAuthor = async(req, res, next)=>{
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You didn't created this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
