const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    fname:{
        type:String,
        required:true,
        trim:true,
    },
    lname:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    gender:{
        type:String,
        required:true,
        trim:true,
    },
    profileUrl:{
        type:String,
        
    }


})

module.exports = mongoose.model("user",userSchema);