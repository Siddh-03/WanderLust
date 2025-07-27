const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  reviews: {
    type: Schema.Types.ObjectId,
    
  }
});


module.exports = mongoose.model("Listing", listingSchema);
