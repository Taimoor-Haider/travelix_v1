const mongoose= require('mongoose');
const Joi=require('joi');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId,ref:"Customer", required: true },
    bookedItem: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'bookedItemType', // Reference path is determined by the value of the 'bookedItemType' field
            required: true
    },
    bookedItemType: {
            type: String,
            enum: ['Tour', 'Car', 'Hotel'], // Possible types of booked items
            required: true
    },
    date:{type:Date,default:Date.now},

});

const validateBooking=(booking)=>{
        const schema = {
            userId: Joi.objectId().required(),
            bookedItem: Joi.objectId().required(),
            bookedItemType: Joi.string().required().valid('Tour','Car',"Hotel")
        }
        return Joi.validate(booking,schema);
}

const Booking=mongoose.model('Booking',bookingSchema);

exports.Booking = Booking;
exports.ValidateBooking=validateBooking;