const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 11,
    unique: true,
  },
  password: { type: String, minlength: 8, maxlength: 255, required: true },
  image: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["superAdmin", "user", "carOwner", "hotelOwner", "tourOwner"],
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    process.env.JWT_TOKEN
  );
  return token;
};

const validateUser = (user) => {
  const schema = {
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().email().required().email(),
    phone: Joi.string().min(8).max(11).required(),
    password: Joi.string().min(8).max(255).required(),
    image: Joi.string().required(),
    role: Joi.string()
      .required()
      .valid("superAdmin", "user", "carOwner", "hotelOwner", "clubOwner"),
  };

  return Joi.validate(user, schema);
};

const User = mongoose.model("User", userSchema);

exports.User = User;
exports.validateUser = validateUser;
