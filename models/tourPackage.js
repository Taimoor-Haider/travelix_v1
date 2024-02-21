const mongoose=require("mongoose");
const Joi = require("joi");
const tourSchema=new mongoose.Schema({
    title:{type:String,required:true,minlength:3,maxlength:255},
    travelClubId:{type:mongoose.Schema.Types.ObjectId,ref:"TravelClub",required:true},
    description:{
        type:String,
        required:true,
        minlength:30,
        maxlength:1000,
    },
    city:{
        type:String,
        required:true,
        minlength:3,
        maxlength:255,
    },
    images:{
        type:Array,
        validate:{
            validator:function(value){
                return value && value.length>0;
            },
            message:"Please upload atleast one image"
        }
    },
    duration:{
        type:String,
        required:true,
    },
    personsAllowed:{
        type:Number,
        required:true,
        min:1,
    },
    amenities:{
        type:Array,
        required:true,
        validate:{
            validator:function(value){
                return value && value.length>0;
            },
            message: 'Amenities must not be empty'
        }
    },
    //    name:{
    //     type:String,
    //     required:true,
    //     minlength:3,
    //     maxlength:255
    //    },
    //    image:{
    //     type:String,
    //     required:true,
    //    }
    // },
    availableDates: {
        type: [new mongoose.Schema({
            startDate: {
                type: Date,
                required: true
            },
            finishDate: {
                type: Date,
                required: true
            }
        })], // Use the schema of AvailableDates
        required: true,
        validate: {
            validator: function(value) {
                return Array.isArray(value) && value.length > 0;
            },
            message: 'Available dates array must not be empty'
        }
    }
})

const Tour=mongoose.model("Tour",tourSchema);

const validateTour = (tour) => {
    const schema = {
        title: Joi.string().min(3).max(255).required(),
        travelClubId: Joi.objectId().required(),
        description: Joi.string().min(20).max(1000).required(),
        city: Joi.string().min(3).max(255).required(),
        images: Joi.array().items(Joi.string()).min(1).required(), // Updated validation for images
        duration: Joi.string().min(3).max(255).required(),
        personsAllowed: Joi.number().min(1).required(),
        amenities: Joi.array().items(Joi.string()).min(1).required(), // Assuming amenities is an array of strings
        availableDates: Joi.array().items(Joi.object({
            startDate: Joi.date().required(),
            finishDate: Joi.date().required()
        })).min(1).required() // Updated validation for availableDates
    };
    return Joi.validate(tour, schema);
};


exports.Tour = Tour;
exports.validate=validateTour;