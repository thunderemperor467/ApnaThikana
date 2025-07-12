const express = require("express");
const app = express();
const mongoose = require("mongoose");  //DB REQUIRE
const ejs = require("ejs");  //EJS 
const path = require("path"); //EJS PATH
const Listing = require('./models/listing.js');  //Connect DB in Models
const methodOverride = require("method-override");  //PUT method override    



// const methodOverride = require("method-override");
app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));   //FOR PARSING DATA
app.use(methodOverride("_method"));  


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
app.get("/listings", async(req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
});


//Create Route: New and Create and read route 
app.get("/listings/new", async(req,res)=>{
    res.render("./listings/new.ejs")
});

app.post("/listings", async(req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save()
    .then((res)=>{
        console.log(res);
    })
    .catch((err)=>{
        console.log(err);
    })

    res.redirect("/listings");
})


//UPDATE: EDIT AND UPDATE ROUTE
app.get("/listings/:id/edit", async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

app.put("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})


//Show Route
app.get("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", {listing})
})

//DELETE ROUTE
app.delete("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})




//Basic Api
app.get("/", (req, res)=>{
    res.send("root is working");
})
//Server Testing
app.listen(8080,(Req, res)=>{
    console.log("Server Working");
})