require("dotenv").config();
console.log("Mongo URI:", process.env.MONGO_URI);
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
// const mongo_url = "mongodb://127.0.0.1:27017/wanderLust";
const Listing = require("./models/listings.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

//Middleware
app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cors());

//Server Connection
async function main() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // 10 seconds
  });
}

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Welcome to WanderLust");
});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings", { listings });
  })
);

app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

app.get(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("show", { listing });
  })
);

app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    //   console.log(listing);
  })
);

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
  })
);

app.put(
  "/listings/:id",
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

    res.redirect(`/listings/${id}`);
  })
);

app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

//Reviews
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    // console.log(newReview);
    // console.log(listing);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  })
);

//delete review

app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});

// app.use((err, req, res, next) => {
//   res.send("Something went wrong");
// });

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
