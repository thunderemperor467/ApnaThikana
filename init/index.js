const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");


main()
    .then((res) => {
        console.log("connected to DB");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/apnathikana');
}

const initDB = async (req, res) => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj, owner: "6878d096c9421a8244f23a7d"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();