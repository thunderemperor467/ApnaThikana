const Listing = require("../models/listing");

module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}

module.exports.new = async(req,res)=>{
    res.render("./listings/new.ejs")
}

module.exports.newpost = async(req, res, next)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
};

module.exports.show = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");    //we do populate to show all data in form of id's etc
    if(!listing){
        req.flash("error", "Invalid Request")
        return res.redirect("/listings")
    }
    // console.log(listing);
    res.render("./listings/show.ejs", {listing})
}


module.exports.edit = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}



module.exports.updatePost = async(req,res)=>{  //use valaidateListning for the error handling on server side by Joi
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
}

module.exports.delete = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
}