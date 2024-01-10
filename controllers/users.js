const passport = require("passport");
const User = require("../models/user");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to YelpCamp");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if(err){
            return next(err)
        }
        req.flash("success", "Logged Out");
        res.redirect("/campgrounds");
    });
}