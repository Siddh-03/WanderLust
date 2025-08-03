const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings", { listings });
  })
);

router.get("/new", (req, res) => {
  res.render("listings/new");
});

router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "Requested Listing doesn't exist");
      res.redirect("/listings");
    }
    res.render("show", { listing });
  })
);

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing created");
    res.redirect("/listings");
    //   console.log(listing);
  })
);

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Requested Listing doesn't exist");
      res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
  })
);

router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listingData = { ...req.body.listing };

    const imageUrl = listingData.image;
    delete listingData.image;

    await Listing.findByIdAndUpdate(id, {
      ...listingData,
      "image.url": imageUrl,
    });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
