const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
//Connect DB in Models
const Listing = require('./models/listing.js');

// const methodOverride = require("method-override");

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




//Basic Api
app.get("/", (req, res)=>{
    res.send("root is working");
})
//Server Testing
app.listen(8080,(Req, res)=>{
    console.log("Server Working");
})