const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Tour, validate } = require("../models/tourPackage");
const auth = require("../middleware/auth");
const isTourOwner = require("../middleware/tourOwner");
//Get all Tours
router.get("/", async (req, res) => {
  const tours = await Tour.find();
  res.status(200).send(tours);
});

//Get a Tour by a specific ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid Id!");
  }
  const tour = await Tour.findById(id);
  if (!tour) {
    return res.status(404).send("No Tour found");
  }
  return res.status(200).send(tour);
});

//Only Travel club owner can create aTravel Package
//Create a new Tour
router.post("/", [auth, isTourOwner], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  console.log("No error");

  const tour = new Tour({
    title: req.body.title,
    travelClubId: req.body.travelClubId,
    description: req.body.description,
    city: req.body.city,
    images: req.body.images,
    duration: req.body.duration,
    personsAllowed: req.body.personsAllowed,
    amenities: req.body.amenities,
    availableDates: req.body.availableDates,
  });

  try {
    console.log(tour);
    await tour.save();
    console.log("tour Saved");
    res.status(200).send(tour);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

//Update the Tour
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid Id!");
  }
  const tour = await Tour.findByIdAndUpdate(id, req.body, { new: true });
  if (!tour) {
    return res.status(404).send("Tour not found");
  }
  return res.status(200).send(tour);
});

// Delete the Tour
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid Id!");
  }
  const tour = await Tour.findByIdAndDelete(id);
  if (!tour) {
    return res.status(404).send("Tour not found");
  }
  return res.status(200).send(tour);
});

module.exports = router;
