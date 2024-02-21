const express = require("express");
const Joi = require("joi");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = express.Router();
const jwt = require("jsonwebtoken");

//Get Users List
// Create a new User
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("Invalid email or password.");
    } else {
      const salt = await bcrypt.genSalt(10);
      const isValid = await bcrypt.compare(req.body.password, user.password);
      const haveRole = compare(user.role, req.body.role);

      if (!isValid || !haveRole) {
        return res.status(400).send("Invalid email or password.");
      }
      const token = user.generateAuthToken();
      res.status(200).send(token);
    }
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

const validateUser = (user) => {
  const schema = {
    email: Joi.string().email().required().email(),
    password: Joi.string().min(8).max(255).required(),
    role: Joi.string()
      .required()
      .valid("superAdmin", "user", "carOwner", "hotelOwner", "clubOwner"),
  };

  return Joi.validate(user, schema);
};
function compare(s1, s2) {
  if (s1 == s2) {
    return true;
  }
  return false;
}
module.exports = router;
