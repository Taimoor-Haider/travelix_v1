const express = require("express");
const mongoose = require("mongoose");
const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const router = express.Router();

//Get Users List
router.get("/", async (req, res) => {
  const users = await User.find();
  res.status(200).send(users);
});

//Get User by a specific ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid user Id!");
  }
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).send("User not found!");
  }
  res.status(200).send(user);
});

// Create a new User
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    let exists = await User.findOne({ email: req.body.email });
    if (exists) {
      return res.status(400).send("User already exists!");
    } else {
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        image: req.body.image,
        role: req.body.role,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
      await user.save();
      const token = user.generateAuthToken();
      res
        .header("x-auth-token", token)
        .status(200)
        .send(
          _.pick(user, [
            "_id",
            "lastName",
            "lastName",
            "email",
            "phone",
            "image",
            "role",
          ])
        );
    }
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

//Update a User
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid user Id!");
  }
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).send("User not found!");
  }
  user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
  user.lastName = req.body.lastName ? req.body.lastName : user.lastName;
  user.email = req.body.email ? req.body.email : user.email;
  user.phone = req.body.phone ? req.body.phone : user.phone;
  user.password = req.body.password ? req.body.password : user.password;
  user.image = req.body.image ? req.body.image : user.image;
  user.role = req.body.role ? req.body.role : user.role;

  try {
    const result = await user.save();
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//Delete a User

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid user Id!");
  }
  try {
    // Find user by ID and delete
    const deletedUser = await User.findByIdAndDelete(id);

    // If user is not found
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // User successfully deleted
    res.json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
