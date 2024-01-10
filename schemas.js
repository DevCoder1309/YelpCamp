// defining JOI schema using a middleware and using it in specific routes:
const AppError = require("./utils/ExpressError");
const Joi = require('joi')
const validateCampground = (req, res, next) => {
  const { error } = Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
    // image: Joi.array().required(),
    // image: Joi.string().required(),
    description: Joi.string().required(),
    deleteImage: Joi.array()
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

module.exports = validateCampground;