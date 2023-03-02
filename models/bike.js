const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    average: {
        type: Number,
    },
    chargeperday: {
        type: Number,
    },
    bikenumber:{
        type:String,
    },
    status:{
        type: Boolean,
    },
    image:{
        data: String,
        contentType: String
    },
    revenueOnBike :{
        type : Number,
    },
    bPurchaseDate:{
        type: Date,
    },
    bRentStatus :{
        type:String,
    }
})

module.exports = mongoose.model('Bike', bikeSchema)