const mongoose = require('mongoose');
const UserModel = require('../models/user');
const BikeModel = require('../models/bike');

const bookBikeSchema = new mongoose.Schema({
    bikeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Bike',
    },
    userId:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
    pickupDate : {
        type : Date,
        required:true,
    },
    dropDate : {
        type : Date,
        required:true,
    },
    chargeperday : {
        type : Number,
    }
})

module.exports = mongoose.model('bookbike', bookBikeSchema)