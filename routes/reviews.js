const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Joi = require("joi");
const AppError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const Review = require("../models/reviews");
const { isLoggedIn } = require("../middleware");
const { isReviewAuthor } = require("../middleware");
const {createReview, deleteReview} = require('../controllers/reviews')

const validateReview = (req, res, next) => {
  const { error } = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  })
    .required()
    .validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};


router.post("/:id/reviews",isLoggedIn, validateReview, catchAsync(createReview));

router.delete("/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(deleteReview));


module.exports = router;