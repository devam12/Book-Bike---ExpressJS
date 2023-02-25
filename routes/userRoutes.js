const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const app = require('../server')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const UserModel = require('../models/user');


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
            lincenceNumber: req.body.lincenceNumber,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            image: {
                data: '/uploads/'+image.name,
                contentType: 'image/png'
            }
        })
        userObj.confirmPassword = undefined;
        userObj.password = generateHashPassword(userObj.password);
        const userSave = await userObj.save();
        res.send(userSave);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})

router.post('/login', async (req, res) => {
    try {
        email = req.body.email;

        const user = await UserModel.findOne({email : email});
        if(!user){
            return res.status(400).send("Email Not Found");
        }
        const isMatch = await bcrypt.compare(req.body.password , user.password)  
        if(isMatch){
            return res.send("Successfully login");
        }
        else{
            return res.send("Invalid password");
        }    
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})


const generateHashPassword = async (password) =>{
    return await bcrypt.hash(userObj.password, saltRounds);
}


module.exports = router;






