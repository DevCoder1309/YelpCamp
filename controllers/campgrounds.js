const Campground = require('../models/campground')
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOXTOKEN
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index.ejs", { campgrounds });
};

module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit.ejs", { campground });
};

module.exports.show = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (campground) {
    res.render("campgrounds/show.ejs", { campground });
  } else {
    req.flash("error", "Sorry Could Not Find CampGround");
    return res.redirect("/campgrounds");
  }
};

module.exports.editpost = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, req.body, { new: true });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.image.push(...imgs);
  await campground.save()
  if(req.body.deleteImage){
    for(let filename in req.body.deleteImage){
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({$pull: {image: {filename: {$in: req.body.deleteImage}}}});
  }
  req.flash("success", "Successfully Updated Campground");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.saveCampGround = async (req, res) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.location,
    limit: 1
  }).send()
  const body = req.body;
  const campground = new Campground(body);
  campground.geometry = geoData.body.features[0].geometry;
  campground.image = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.author = req.user.id;
  await campground.save();
  req.flash("success", "successfully made a new campground");
  res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.deleteCampGround = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground");
  res.redirect("/campgrounds");
};