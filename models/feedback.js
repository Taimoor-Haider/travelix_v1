const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/travelix').then(()=>{
    console.log("Database connection established!");
}).catch((err) => console.log("Error connecting to Database: ",err));


const feedbackSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId,ref:"Customer", required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    date:{type:Date,default:Date.now},
    travelPackage: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' } // Reference to the Travel model
});



const Feedback=mongoose.model('Feedback',feedbackSchema);


async function createFeedback(){
    const fb=new Feedback({
        user:"65cf8e27915cc3fac27a3774",
        comment:"This is a good feedback",
        rating:4,
        date:new Date(2024-2-16),
        travelPackage:"65cf925dce65d0a5086118a3"
    })

    try {
        const feedback=await fb.save();
        console.log(feedback);
    } catch (ex) {
        console.log(ex);        
    }
}
createFeedback();
module.exports=Feedback;