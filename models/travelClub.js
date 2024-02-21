const mongoose = require("mongoose");
const Joi= require("joi");
const {User} =require("./user");
const Tour=require("./tourPackage");


const travelClubSchema = new mongoose.Schema({
    owner:{
        ownerId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        address:{
            type:String,
            required:true,
            minlength:3,
            maxlength:255,
        },
        cnicImage:{
            type:String,
            required:true,
        }
    },
    clubName: { type: String , required: true,minlength:3,maxlength:255 },
    description: { type: String, required: true,minlength:3,maxlength:255 },
    location: { type: String, required: true,minlength:3,maxlength:255 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    numberOfReviews: { type: Number,min:0, default: 0 },
    tours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tour' }],
    date:{ type: Date,default: Date.now },
    isRegistered: { type: Boolean, default: false },
});

const validateTravelClub = (travelClub) => {
    const schema = {
        owner: {
            ownerId: Joi.objectId().required(),
            address: Joi.string().min(3).max(255).required(),
            cnicImage: Joi.string().required(),
        },
        clubName: Joi.string().min(3).max(255).required(),
        description: Joi.string().min(3).max(255).required(),
        location: Joi.string().min(3).max(255).required(),
        rating: Joi.number().min(0).max(5).optional(),
        numberOfReviews: Joi.number().min(0).optional(),
        tours: Joi.array().items(Joi.objectId()).optional(),
        date: Joi.date().optional(),
        isRegistered: Joi.boolean().optional(),
    }
    return Joi.validate(travelClub, schema);
}

const TravelClub = mongoose.model("TravelClub", travelClubSchema);


exports.TravelClub = TravelClub;
exports.validate=validateTravelClub;