const Listing = require("../models/listings");
const fetch = require("node-fetch");

// Index Route
module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/listings", { listings });
};

// Show Listing Route
module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Requested Listing doesn't exist");
    return res.redirect("/listings");
  }
  // We pass the listing object (with its coordinates) to the show page
  res.render("listings/show", { listing });
};

module.exports.newListing = async (req, res) => {
  const location = req.body.listing.location;
    const apiKey = process.env.MAP_TILER;

    const geocodingUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${apiKey}`;
    const geoResponse = await fetch(geocodingUrl);
    const geoData = await geoResponse.json();
    
    // ADD THIS CHECK
    if (!geoData.features || geoData.features.length === 0) {
        req.flash("error", "Address not found. Please enter a valid location.");
        return res.redirect("/listings/new");
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url: req.file.path, filename: req.file.filename };
    newListing.geometry = geoData.features[0].geometry;

    await newListing.save();
    
    req.flash("success", "New Listing created");
    res.redirect(`/listings`);
};

// Edit Listing Form Route
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Requested Listing doesn't exist");
    return res.redirect("/listings");
  }
  let originalImage = listing.image.url.replace("/upload", "/upload/w_250");
  res.render("listings/edit", { listing, originalImage });
};

// Update Listing Route
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    listing.image = { url: req.file.path, filename: req.file.filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

// Delete Listing Route
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};
