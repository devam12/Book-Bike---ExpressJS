
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes')
const path = require('path')
const cors = require("cors");
var fs = require('fs');
const bike = require('./models/bike');
const app = express()
const port = 3000
require('dotenv').config();


//Middelware
app.use(express.static(path.join(__dirname,"static")))
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());


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


//Routes
app.use('/admin',adminRoutes)


//Start Application
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/admin/`)
})

