const mongoose = require("mongoose");
const initData = require("./data.js"); // this takes data
const Listing = require("../models/listing.js"); //this takes schema

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

main()
.then(()=>{
    console.log("db connected");
}).catch((err)=>{
    console.log(err);
})  

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({
    ...obj,
    owner: "68584badc1997c8623d5ad3a"
  }))
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();