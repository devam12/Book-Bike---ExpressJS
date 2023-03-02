const express = require('express')
const app = require('../server')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const UserModel = require('../models/user');
// const sessionUser = require('../middelware/auth')
const router = express.Router()


//Router
//Register User
router.post('/register', async (req, res) => {
    try {
        let image  = req.files.userImage;
        image.mv(__dirname+'/../uploads/'+image.name);
        console.log(req.body);

        email = req.body.email;
        const user = await UserModel.findOne({email : email});
        if(user){
            return res.status(400).send("User Already Register Found");
        }
  
        const userObj = new UserModel({
            fullName: req.body.fullName,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email,
            status: true,
            noOfBookings : 0,
            revenueOnUser : 0,
            licenceNumber: req.body.licenceNumber,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            isAdmin : false,
            image: {
                data: '/uploads/'+image.name,
                contentType: 'image/png'
            } 
        })
        //Pre function hasingpassword() call before save() 
        const userSave = await userObj.save();
        req.session.user = userSave;
        res.send(userSave);         
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})


//getAllUser
router.get('/users',async (req, res) => {
    try {
        console.log(req.cookies);
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


//ChangeStatus 
router.post('/changeStatus', async (req, res) => {
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

module.exports = router;