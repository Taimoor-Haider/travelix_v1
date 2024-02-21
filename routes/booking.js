const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {Booking,ValidateBooking} =require("../models/booking");


router.get("/",async (req,res)=>{
    const bookings=await Booking.find();
    res.status(200).send(bookings);
})
router.get("/:id",async (req,res)=>{
    const id=req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send("Invalid user Id!");
    }
    const booking=await Booking.findById(id);
    if(!booking) {
        return res.status(404).send('Booking not found');
    }
    res.status(200).send(booking);
})
router.post("/",async(req,res)=>{
    const {error} =ValidateBooking(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    console.log("No error occured!!")
    try {
        const booking=new Booking({
            userId:req.body.userId,
            bookedItem:req.body.bookedItem,
            bookedItemType:req.body.bookedItemType,
    
        })
        const result=await booking.save();
        res.status(200).send(result);
        
    } catch (error) {
        res.status(400).send(error.message);
    }
})

//Update payment

router.put("/:id",async(req,res)=>{
    const {error}=ValidateBooking(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const id=req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send('Invalid Id!');
    }
    const booking=await Booking.findByIdAndUpdate(id, req.body, { new: true });
    if(!booking) {
        return res.status(404).send('Booking not found');
    }
    res.status(200).send(booking);
})

//Delete the Payment
router.delete('/:id',async(req,res)=>{
    const id=req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send('Invalid Id!');
    }
    const booking=await Booking.findByIdAndDelete(id);
    if(!booking) {
        return res.status(404).send('Booking not found');
    }
    res.status(200).send(booking);
})


module.exports=router;