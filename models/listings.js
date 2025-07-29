const { application } = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review")

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: {
    filename: String,
    url: {
      type: String,
      default: "https://www.w3schools.com/w3images/lights.jpg",
      set: (v) =>
        v === "" ? "https://www.w3schools.com/w3images/lights.jpg" : v,
    },
  },
  price: { type: Number },
  location: { type: String },
  country: { type: String },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete" , async(listing) => {
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}})
  }
})

module.exports = mongoose.model("Listing", listingSchema);
