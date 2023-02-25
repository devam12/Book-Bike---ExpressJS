const express = require('express')
const mongoose = require('mongoose')
const app = require('../server')
const fileUpload = require('express-fileupload');
const fs = require('fs')
const path = require('path')
const router = express.Router()
const BikeModel = require('../models/bike');


//Router

//addBikeModel
router.post('/bike', async (req, res) => {
    let image  = req.files;
    image.bImage.mv(__dirname+'/../uploads/'+image.bImage.name);

    const bikeObj = new BikeModel({
        name: req.body.bName,
        average: req.body.bAverage,
        chargeperday: req.body.bRentalCharge,
        bikenumber: req.body.bNumber,
        status: true,
        bPurchaseDate: req.body.bPurchaseDate,
        bRentStatus: "Available",
        image: {
            data: '/uploads/'+image.bImage.name,
            contentType: 'image/png'
        }
    })
    try {
        const bikesave = await bikeObj.save();
        res.send(bikesave);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


//getAllBike
router.get('/bike', async (req, res) => {
    try {
        const bike = await BikeModel.find();
        res.send(bike);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//getBikeById
router.get('/bike/:id', async (req, res) => {
    try {
        const bike = await BikeModel.findById(req.params.id)
        res.send(bike);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


//getPerPageBike
router.get('/getPageBikes/:page', async (req, res) => {
    try {
        const page = req.params.page;
        let limit = 2;
        let skip = (page - 1) * limit;
        const bike = await BikeModel.find().skip(skip).limit(limit);
        res.send(bike);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//ChangeStatus 
router.post('/changeStatus', async (req, res) => {
    try {
        const bike =  await BikeModel.findById(req.body.id)
        if(bike!==null){
            let changeStatus;
            if(bike.status==true){
                changeStatus = { status: false }
            }
            else{
                changeStatus = { status: true }
            }
            const updateStatusBike = await BikeModel.updateOne(bike, changeStatus)
            console.log(updateStatusBike);
            console.log(bike);
            res.send(updateStatusBike);
        }
        else{
            res.send("Empty-------------")
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Exports adminRouter
module.exports = router;