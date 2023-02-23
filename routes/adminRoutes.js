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
router.post('/bike',upload.single('bImage'), async (req, res) => {
    console.log(req.body);
    const bikeObj = new BikeModel({
        name : req.body.bName,
        average : req.body.bAverage,
        chargeperday : req.body.bRentalCharge,
        bikenumber : req.body.bNumber,
        status:true,
        bPurchaseDate: req.body.purchaseDate.toString(),
        bRentStatus : "Available",
        image: {
            data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
            contentType: 'image/'
        }
    })
    try {
        const bikesave = await bikeObj.save();
        res.send(bikesave);
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//getAllBike
router.get('/bike', async (req, res) => {
    try {
        const bike = await BikeModel.find();   
        res.send(bike);
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }  
})


//getAllBike
router.get('/getPageBikes/:page', async (req, res) => {
    try {
        const page  = req.params.page;
        let limit = 2;
        let skip = (page-1)*limit;
        const bike = await BikeModel.find().skip(skip).limit(limit);   
        res.send(bike);
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }  
})

router.post('/availableBike', async (req, res) => {
    try {
        const bike = await BikeModel.findById(req.body.id);
        // console.log(req.body.id);
        console.log(bike);
        const changeStatus = { status: true } 
        const updateStatusBike  = await BikeModel.updateOne(bike,changeStatus)  
        console.log(updateStatusBike); 
        res.send(updateStatusBike);
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }  
})

router.post('/unavailableBike', async (req, res) => {
    try {
        const bike = await BikeModel.findById(req.body.id);
        const changeStatus = { status: false } 
        const updateStatusBike  = await BikeModel.updateOne(bike,changeStatus)  
        console.log(updateStatusBike); 
        res.send(updateStatusBike);
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }  
})


//Exports adminRouter
module.exports = router;