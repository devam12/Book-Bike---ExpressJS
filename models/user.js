const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    mobileNumber: {
        type: Number,
    },
    email: {
        type: String,
    },
    gender: {
        type: String,
    },
    status:{
        type: Boolean,
    },
    lincenceNumber :{
        type: String,
    },
    image:{
        data: String,
        contentType: String
    },
    password:{
        type : String,
    },
    confirmPassword:{
        type : String,
    }
})


userSchema.pre("save", async function(){
    
} )

module.exports = mongoose.model('User', userSchema)