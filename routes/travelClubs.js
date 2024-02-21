const mongoose = require("mongoose");
const express = require("express");
const { User } = require("../models/user");
const { TravelClub, validateTravelClub } = require("../models/travelClub");
const router = express.Router();

//Get all TravelClubs
router.get("/", async (req, res) => {
  const travelClubs = await TravelClub.find();
  res.status(200).send(travelClubs);
});

//Get a TravelClub by a specific ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid Id!");
  }
  const travelClub = await TravelClub.findById(id);
  if (!travelClub) {
    return res.status(404).send("TravelClub not found");
  }
  return res.status(200).send(travelClub);
});

//Create a new TravelClub
router.post("/", async (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    image: req.body.image,
    role: req.body.role,
  });
  await user.save();
  try {
    const travelClub = new TravelClub({
      owner: {
        ownerId: await user._id,
        address: req.body.address,
        cnicImage: req.body.cnicImage,
      },
      clubName: req.body.clubName,
      description: req.body.description,
      location: req.body.location,
    });
    console.log(travelClub);

    // Save the travel club
    await travelClub.save();
    console.log("User saved");
    // Send the newly created travel club as a response
    res.status(200).send(travelClub);
  } catch (error) {
    // Handle errors
    res.status(500).send("Internal Server Error");
  }
});
//Update the travel club

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid Id!");
  }
  const travelClub = await TravelClub.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!travelClub) {
    return res.status(404).send("TravelClub not found");
  }
  return res.status(200).send(travelClub);
});
// Delete the travel club

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid Id!");
  }
  const travelClub = await TravelClub.findByIdAndDelete(id);
  if (!travelClub) {
    return res.status(404).send("TravelClub not found");
  }
  return res.status(200).send(travelClub);
});
module.exports = router;
