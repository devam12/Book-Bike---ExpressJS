const express = require('express')
const mongoose = require('mongoose')
const app = require('../server')
const fileUpload = require('express-fileupload');
const fs = require('fs')
const path = require('path')
const router = express.Router()
const BikeModel = require('../models/bike');
// const {sessionUser,generateAccessToken} = require('../middelware/auth')


const {verifyToken} = require('../middelware/auth')

//Router
//addBikeModel
router.post('/bike', async (req, res) => {
    let image  = req.files;
    image.bImage.mv(__dirname+'/../uploads/'+image.bImage.name);

    console.log(req.body);
    const bikeObj = new BikeModel({
        name: req.body.bName,
        average: req.body.bAverage,
        chargeperday: req.body.bRentalCharge,
        bikenumber: req.body.bNumber,
        status: true,
        revenueOnBike : 0,
        bPurchaseDate: req.body.purchaseDate,
        bRentStatus: "Available",
        image: {
            data: '/uploads/'+image.bImage.name,
            contentType: 'image/png'
        }
    })
    try {
        const bikesave = await bikeObj.save();
        // res.send(bikesave);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


//getAllBike
router.get('/bike',async (req, res) => {
    try {
        const bike = await BikeModel.find();
        res.send(bike);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


// Delete All Bike 
router.delete('/bike', async (req, res) => {
    try {
        const bike = await BikeModel.remove();
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
        res.send(bike).json();
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


//getPerPageBike
router.get('/getPageBikes/:page', async (req, res) => {
    try {
        const page = Number(req.params.page);
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
router.post('/changeStatus',verifyToken, async (req, res) => {
    try {
        console.log(req.body);
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
            res.send(updateStatusBike);
        }
        else{
            res.send("Not Found-------------")
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Exports adminRouter
module.exports = router;