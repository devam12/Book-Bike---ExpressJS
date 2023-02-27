const express = require('express')
const app = require('../server')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const UserModel = require('../models/user');
const router = express.Router()


router.post('/register', async (req, res) => {
    try {
        if(req.body.password!=req.body.confirmPassword){
            return res.send("Not match password");
        }
        let image  = req.files.userImage;
        image.mv(__dirname+'/../uploads/'+image.name);
  
        const userObj = new UserModel({
            fullName: req.body.fullName,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email,
            gender: req.body.gender,
            status: true,
            noOfBookings : 0,
            lincenceNumber: req.body.lincenceNumber,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            image: {
                data: '/uploads/'+image.name,
                contentType: 'image/png'
            } 
        })
        //Pre function hasingpassword() call before save()  
        const userSave = await userObj.save();
        req.session.user = userSave;
        res.redirect("/dashboard")
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})

module.exports = router;






