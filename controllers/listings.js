const Listing = require("../models/listings");

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/listings", { listings });
};

module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Requested Listing doesn't exist");
    res.redirect("/listings");
  }
  res.render("listings/show", { listing });
};

module.exports.newListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing created");
  res.redirect(`/listings/${newListing._id}`);
  //   console.log(listing);
};

module.exports.editListingForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Requested Listing doesn't exist");
    res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
};

module.exports.listingUpdate = async (req, res) => {
  let { id } = req.params;
  const listingData = { ...req.body.listing };

  const imageUrl = listingData.image;
  delete listingData.image;
  await Listing.findByIdAndUpdate(id, {
    ...listingData,
    "image.url": imageUrl,
  });
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};
