const jwt = require('jsonwebtoken');
require('dotenv').config();


const verifyToken =((req,res,next) =>{
    console.log(req);
    const token  = req.headers.authentication;
    console.log(token);
    if(!token){
        res.send("Token Empty")
    }
    try{
        const decode = jwt.verify(token,process.env.SESSION_CODE);
        // console.log(decode);
        next();
        // req.user = decode;
    }
    catch(error){
        res.send("Invalid token")
    }
    
})

module.exports = verifyToken