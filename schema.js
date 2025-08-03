const joi = require("joi");
const review = require("./models/review");

module.exports.listingSchema = joi.object({
  listing: joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    country: joi.string().required(),
    location: joi.string().required(),
    price: joi.number().min(0).required(),
    image: joi.string().allow("", null),
  }),
});

module.exports.reviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().required().max(5).min(1),
      comment: joi.string().required(),
    })
    .required(),
});
