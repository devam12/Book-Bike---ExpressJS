const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    mobileNumber: {
        type: Number,
    },
    noOfBookings:{
        type:Number,
    },
    email: {
        type: String,
        unique : true,
        required:true,
    },
    status:{
        type: Boolean,
    },
    licenceNumber :{
        type: String,
        required:true,
    },
    image:{
        data: String,
        contentType: String
    },
    password:{
        type : String,
        required:true,
    },
    confirmPassword:{
        type : String,
    },
    isAdmin:{
        type: Boolean,
    }
})


//Generate Hash code 
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, saltRounds);   
        this.confirmPassword = undefined;    
    }
    next();
})

module.exports = mongoose.model('User', userSchema)