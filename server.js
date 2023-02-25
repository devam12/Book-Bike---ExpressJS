
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes')
const userRoutes = require('./routes/userRoutes')
const fileUpload = require('express-fileupload');
const path = require('path')
const cors = require("cors");
var fs = require('fs');
const bike = require('./models/bike');
const app = express()
const port = process.env.PORT || 3000
require('dotenv').config();


//Middelware
app.use(express.static(path.join(__dirname,"/views")))  //Automatic fatch index page using express.static()
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileUpload());
app.use(cors());

//Routes
app.use('/admin',adminRoutes)
app.use('/user',userRoutes)


app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'))
})


//Database Connection 
const mongoString = process.env.DATABASE_URL
mongoose.connect(mongoString);
const database = mongoose.connection
database.on('error', (error) => {
    console.log(error)
})
database.once('connected', () => {
    console.log('Database Connected');
})





//Start Application
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/admin/`)
})

module.exports = app;
