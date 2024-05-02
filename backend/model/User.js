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
        
    },
    role: {
        type: String,
        enum: ["Admin", "User"] 
    },
    isSuperAdmin:{
        type:Boolean,
        required:true,
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    }],
})

module.exports = mongoose.model("user",userSchema);