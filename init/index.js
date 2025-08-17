// Add these to the top
require("dotenv").config({ path: "../.env" }); // Correctly locate .env file
const fetch = require("node-fetch");

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  // Start by clearing the database
  await Listing.deleteMany({});

  // Use a for...of loop to handle async operations correctly
  for (let listing of initData.data) {
    try {
      // 1. Get the location string from the sample data
      const location = listing.location;
      const apiKey = process.env.MAP_TILER;

      // 2. Perform the geocoding request for this location
      const geocodingUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(
        location
      )}.json?key=${apiKey}`;
      const geoResponse = await fetch(geocodingUrl);
      const geoData = await geoResponse.json();

      // 3. Add the geometry and owner data to the listing object
      listing.geometry = geoData.features[0].geometry;
      listing.owner = "6890b6d64bcfb9c0484109c3"; // Your hardcoded owner ID

      // 4. Save the single, complete listing to the database
      const newListing = new Listing(listing);
      await newListing.save();
    } catch (e) {
      console.log(`Could not geocode ${listing.location}. Skipping.`);
      console.log(e.message);
    }
  }

  console.log("data was initialized with coordinates");
};

initDB();
