const mongoose = require("mongoose");
const review = require("./review.js");
const Review = require("./review.js");
const User = require("./user.js");
const { listingSchema } = require("../schema.js");

const Schema = mongoose.Schema; // so that we do not have to write "mongoose.Schema" again and again

const ListingSchema = new Schema({
    title: {
        type:String,
        required: true
    },
    description: String,
    image: {
        type:String,
        default:"https://plus.unsplash.com/premium_photo-1664361480872-6416aab14696?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dHJhdmVsfGVufDB8fDB8fHww", // this is for when "jab image hi nahi aa rahi hai" ie "image is undefined/null/does not exist"
        set: (v)=> v===""?"https://plus.unsplash.com/premium_photo-1664361480872-6416aab14696?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dHJhdmVsfGVufDB8fDB8fHww":v // this is for the case "Jab image aa rahi hai par wo khali hai" ie "image link is empty" 
    },
    price:Number,
    location: String,
    country: String,
    reviews:[
        { 
            type:Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
})

ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
})

const Listing = mongoose.model("Listing",ListingSchema);

module.exports = Listing;