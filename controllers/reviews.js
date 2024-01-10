const Review = require('../models/reviews')
const Campground = require("../models/campground");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const review = new Review(req.body);
  review.author = req.user.id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Created new Review Successfully");
  res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted a review");
  res.redirect(`/campgrounds/${id}`);
};