const express = require('express')
const mongoose = require('mongoose')
const multer = require("multer");
const uploadDestination = multer({dest:'/../uploads/'})
const fs = require('fs')
const path = require('path')
const router = express.Router()
const BikeModel = require('../models/bike');


//Define photo storage
var storage = multer.diskStorage({
	destination: 'uploads',
	filename: (req, file, cb) => {
		cb(null, file.originalname + '-' + Date.now())
	},
})
var upload = multer({ 
    storage: storage 
})


//Router
//indexPage
router.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname,'../views/index.html'))
})


//addBikeModel
router.post('/addbike',upload.single('bImage'), async (req, res) => {
    const bikeObj = new BikeModel({
        name : req.body.bName,
        average : req.body.bAverage,
        chargeperday : req.body.bRentalCharge,
        bikenumber : req.body.bNumber,
        status:true,
        image: {
            data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
            contentType: 'image/'
        }
    })
    try {
        const bikesave = await bikeObj.save();
        res.send("Save data");
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})


//Exports adminRouter
module.exports = router;