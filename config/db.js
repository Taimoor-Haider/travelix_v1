const mongoose= require('mongoose');


async function connectDb(){
    try{
        await mongoose.connect('mongodb://localhost/travelix')
        console.log("Connected to MongoDB..")
    }catch(err){
        console.log(err);
    }
}

module.exports = connectDb;