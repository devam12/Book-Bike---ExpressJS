const express = require('express')
const mongoose = require('mongoose')
const app = require('../server')
const fileUpload = require('express-fileupload');
const fs = require('fs')
const path = require('path')
const router = express.Router()
const BikeModel = require('../models/bike');
const BookBikeModel = require('../models/bookbike');
const UserModel = require('../models/user');
const {verifyAccessToken} = require('../middelware/auth')

//Router
//addBikeModel
router.post('/bike', verifyAccessToken, async (req, res) => {
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
router.get('/bike',verifyAccessToken,async (req, res) => {
    try {
        const bike = await BikeModel.find();
        res.send(bike);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


// Delete All Bike 
router.delete('/bike',verifyAccessToken, async (req, res) => {
    try {
        const bike = await BikeModel.remove();
        res.send(bike);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


//getBikeById
router.get('/bike/:id',verifyAccessToken, async (req, res) => {
    try {
        const bike = await BikeModel.findById(req.params.id)
        res.send(bike).json();
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


//getPerPageBike
router.get('/getPageBikes/:page',verifyAccessToken, async (req, res) => {
    try {
        const page = Number(req.params.page);
        let limit = 2;
        let skip = (page - 1) * limit;
        const bike = await BikeModel.find().skip(skip).limit(limit);
        if(bike!==null){
            res.send(bike);
        }
        else{
            res.send("Empty")
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//ChangeStatus 
router.post('/changeBikeStatus',verifyAccessToken, async (req, res) => {
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
            res.send(bike.status);
        }
        else{
            res.send("Not Found-------------")
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


//ChangeStatus User (Block/Unblock)
router.post('/changeUserStatus',verifyAccessToken, async (req, res) => {
    try {
        const user =  await UserModel.findById(req.body.id)
        if(user!==null){
            let changeStatus;
            if(user.status==true){
                changeStatus = { status: false }
            }
            else{
                changeStatus = { status: true }
            }
            const updateStatusUser = await UserModel.updateOne(user, changeStatus)
            res.send(user.status);
        }
        else{
            res.send("Empty")
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


//Recent Booking
router.get('/recentBooking',verifyAccessToken, async (req, res) => {
    try {
        const bookedbike =  await BookBikeModel.find({}).sort({_id:-1}).limit(5);
        if(bookedbike!==null){
            var results = await Promise.all(bookedbike.map(async (element, index) => {
                let obj = {};
                const user = await UserModel.findById(element.userId);
                const bike = await BikeModel.findById(element.bikeId);
                obj.fullName = user.fullName;
                obj.bikeName = bike.name;
                obj.daysBooked = element.daysBooked;
                obj.chargeperday = element.chargeperday;
                obj.revenueOnBike = element.daysBooked * element.chargeperday;
                return obj;
                // console.log(index,"",user.fullName,"  ",bike.name,"  ",element.daysBooked,"  ",element.chargeperday,"  ",element.daysBooked*element.chargeperday);
            }));
            res.send(results);
        }
        else{
            res.send("Empty")
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


//Total Booking
router.get('/getTotalBooking',async (req, res) => {
    try {
        const getBooking = await BookBikeModel.estimatedDocumentCount();
        res.send(String(getBooking));
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


//Total User
router.get('/getTotalUser',async (req, res) => {
    try {
        const getUser = await UserModel.estimatedDocumentCount();
        res.send(String(getUser));
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


//Total Revenue
router.get('/getTotalRevenue',async (req, res) => {
    try {
        const getData = await BookBikeModel.find();
        let totalRevenue = 0;
        getData.forEach(element => {
            totalRevenue+=element.chargeperday*element.daysBooked;
        });
        res.send(String(totalRevenue));
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Exports adminRouter
module.exports = router;