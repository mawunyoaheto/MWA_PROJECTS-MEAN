const mongoose = require("mongoose");

const ActorsSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    awards: Number
});


const MoviesSchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    year:{
        type:Number,
        required: true
    },
    actors:[ActorsSchema]
});

mongoose.model(process.env.MOVIES_MODEL,MoviesSchema,process.env.MOVIES_COLLECTION);

