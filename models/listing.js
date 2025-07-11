const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        filename: String,
        url: {
            type: String,
            required: true,
            set: (v) => v === "" ? "https://unsplash.com/photos/a-lake-surrounded-by-mountains-under-a-blue-sky-Aln972onVgE" : v,
        },
    },

    price:{
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports= Listing;