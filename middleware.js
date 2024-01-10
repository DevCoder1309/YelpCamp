const Campground = require('./models/campground')
const Review = require("./models/reviews");
module.exports.isLoggedIn = isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Login is Required");
    return res.redirect("/login");
  }
  next();
};


module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  if (!campground.author.equals(req.user.id)) {
    req.flash("error", "You Dont have the permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user.id)) {
    req.flash("error", "You Dont have the permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
