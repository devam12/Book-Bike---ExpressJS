require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes')
const userRoutes = require('./routes/userRoutes')
const fileUpload = require('express-fileupload');
const UserModel = require('./models/user');
const bcrypt = require('bcrypt')
var session = require('express-session')
var cookieParser = require("cookie-parser");
const path = require('path')
const cors = require("cors");
var fs = require('fs');
const bike = require('./models/bike');
const app = express()
const port = process.env.PORT || 3000

//Middelware
app.use(express.static(path.join(__dirname,"/views")))  //Automatic fatch index page using express.static()
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload());
app.use(cors());
app.use(session({
  key:'usersid',
  secret: process.env.SESSION_CODE,
  resave: false,
  saveUninitialized: false,
  cookie: 
    { 
      expires: 600000
      // secure: true
    }
}))
app.use(cookieParser());


//Routes
app.use('/admin',adminRoutes)
app.use('/user',userRoutes)



// app.use((req,res,next)=>{
//   if(req.session.user && req.cookies.usersid){
//     res.redirect("/dashboard")
//   }
//   next();
// })

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.usersid) {
      res.sendFile(path.join(__dirname,"/views/dashboard.html"))
      // res.send(req.session.user);
  } else {
    next();
  }
};


app.get('/login', sessionChecker,async (req, resgugu) => {
  // res.sendFile(path.join(__dirname,"/views/login.html"))

})

app.get('/', sessionChecker,async (req, res) => {
  // res.sendFile(path.join(__dirname,"/views/login.html"))
  res.redirect("/login");
})

app.get('/logout', async (req, res) => {
  res.clearCookie("usersid");
  if (req.session.user) {
    req.session.destroy
    console.log("logout successfull");
  }
  res.redirect("/");
})

app.get('/dashboard',sessionChecker, async (req, res) => {
  // res.sendFile(path.join(__dirname,"/views/login.html"))
  res.redirect("/login");
})

app.get('/signup',sessionChecker, async (req, res) => {
  res.sendFile(path.join(__dirname,"/views/signup.html"))
})

app.post('/login', async (req, res) => {
  try {
      email = req.body.email;
      const user = await UserModel.findOne({email : email});
      if(!user){
          res.status(400).send("Email Not Found");
      }
      console.log(user);
      const isMatch = await bcrypt.compare(req.body.password , user.password)  
      if(isMatch){
        
          req.session.user = user;
          // res.status(200).send(user).json();
          console.log("login successfull");
          res.redirect("/dashboard")
          // res.redirect("https://192.168.29.56/index.html");
      }
      else{
        // res.redirect("/login");
        res.send("Invalid password");
      }    
  }
  catch (error) {
      res.status(400).json({ message: error.message });
  }
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

app.use(function(e, req, res, next) {
  if (e.message === "Bad request") {
      res.status(400).json({error: {msg: e.message, stack: e.stack}});
  }
});


//Start Application
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/admin/`)
})

module.exports = app;
