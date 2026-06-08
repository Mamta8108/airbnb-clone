const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
.then(() => {
  console.log("connected to db");
})
.catch((err)=>{
  console.log(err);
});

async function main(){
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  const updatedData = data.data.map((obj) => ({
    ...obj,
    owner: "69d11385f9c6b8a18a1b760b",
  }));

  await Listing.insertMany(updatedData);

  console.log("data was initialized");
};

initDB();