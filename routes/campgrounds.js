const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const validateCampground = require("../schemas");
const {isLoggedIn} = require('../middleware');
const { isAuthor } = require("../middleware");
const {index, edit, show, editpost, saveCampGround, deleteCampGround} = require('../controllers/campgrounds')
const multer = require("multer");
const {storage} = require('../cloudinary/index')
const upload = multer({ storage });
// const AppError = require("../utils/ExpressError");
// const Joi = require("joi");
// const validateCampground = (req, res, next) => {
//   const { error } = Joi.object({
//     title: Joi.string().required(),
//     price: Joi.number().required().min(0),
//   })
//     .required()
//     .validate(req.body);
//   if (error) {
//     const msg = error.details.map((e) => e.message).join(",");
//     throw new AppError(msg, 400);
//   } else {
//     next();
//   }
// };


router.get("/", catchAsync(index));

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new.ejs");
});

router.get("/:id/edit",isLoggedIn, isAuthor,catchAsync(edit));

router.get("/:id",catchAsync(show));

//all the post routes are listed here:

router.put("/:id", isLoggedIn, upload.array("image"), validateCampground, isAuthor,catchAsync(editpost));

router.post("/",isLoggedIn, upload.array("image"), validateCampground, catchAsync(saveCampGround));


router.delete("/:id", isLoggedIn, catchAsync(deleteCampGround));

module.exports = router;