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
        data: Buffer,
        contentType: String
    }
})

module.exports = mongoose.model('bike', bikeSchema)