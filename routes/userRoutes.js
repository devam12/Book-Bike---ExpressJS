const express = require('express')
const app = require('../server')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const UserModel = require('../models/user');
const BikeModel = require('../models/bike');
const BookBikeModel = require('../models/bookbike');

const { verifyAccessToken, verifyRefreshToken ,generateAccessToken,generateRefreshToken} = require('../middelware/auth')
const router = express.Router()

//Router
//Register User
router.post('/register', async (req, res) => {
    try {
        let image = req.files.userImage;
        image.mv(__dirname + '/../uploads/' + image.name);
        console.log(req.body);

        email = req.body.email;
        const user = await UserModel.findOne({ email: email });
        console.log(user);
        if (user) {
            res.status(200).send("User Already Register Found");
        }
        else {
            const userObj = new UserModel({
                fullName: req.body.fullName,
                mobileNumber: req.body.mobileNumber,
                email: req.body.email,
                status: true,
                noOfBookings: 0,
                revenueOnUser: 0,
                licenceNumber: req.body.licenceNumber,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword,
                isAdmin: false,
                image: {
                    data: '/uploads/' + image.name,
                    contentType: 'image/png'
                }
            })
            //Pre function hasingpassword() call before save() 
            const userSave = await userObj.save();
            res.send(userSave);
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})


//getAllUser
router.get('/users', async (req, res) => {
    try {
        const user = await UserModel.find();
        res.send(user);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//getPerPageUser
router.get('/getPageUsers/:page', async (req, res) => {
    try {
        const page = Number(req.params.page);
        let limit = 2;
        let skip = (page - 1) * limit;
        const users = await UserModel.find().skip(skip).limit(limit);
        res.send(users);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


//Generate AccessToken using RefreshToken
router.post('/refreshToken', async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        const user = await verifyRefreshToken(refreshToken,req,res);

        const accesstoken = await generateAccessToken(user);
        const refreshtoken = await generateRefreshToken(user);
        res.send({accesstoken : accesstoken,refreshtoken:refreshtoken}).json();
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


//Get Available Status Bike
router.get('/unbookedBike',async (req, res) => {
    try {
        const bike = await BikeModel.find({ bRentStatus : "Available" , status : false });
        console.log(bike);
        res.send(bike);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})



//Book Bike 
router.post('/bookBike',verifyAccessToken, async (req, res) => {
    try {
        console.log(req.body);
        const bike = await BikeModel.findById({ _id: req.body.bId });
        console.log(bike);
        if (!bike) {
            res.status(200).send("Bike Not Found");
        }
        else {
            bike.bRentStatus="Booked";
            bike.save();
            formdata = req.body.formData;
            formdataJsonObj = JSON.parse(formdata);
            const bookingObj = new BookBikeModel({
                bikeId : bike.id,
                userId : req.user.user._id,
                pickupDate : formdataJsonObj.pickupDate,
                dropDate :formdataJsonObj.dropDate,
                chargeperday : bike.chargeperday
            })

            const bookingSave = await bookingObj.save();
            res.send(bookingSave);
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})



module.exports = router;