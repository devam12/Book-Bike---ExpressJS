const jwt = require('jsonwebtoken');
require('dotenv').config();


const generateAccessToken = async (user) =>{
    try{
        const options = {
            expiresIn: "60s",
        }
        const accessToken = jwt.sign({user}, process.env.SESSION_CODE,options);
        return accessToken;
    }
    catch(error){
        console.log(error.message("Invalid token"));
    }
}


const verifyToken =((req,res,next) =>{
    // console.log(req);
    const token  = req.headers.authentication;
    console.log("MyToken : "+token);
    if(token==null){
        res.send("Token Empty")
    }
        try{
            const decode = jwt.verify(token,process.env.SESSION_CODE);
            console.log(decode);
            next();
        }
        catch(error){
            if(error.name=="TokenExpiredError"){
                res.send(error.name)
            }else{
                console.log("Error");
                res.send(error.name)
            }
        }
})

module.exports = {verifyToken,generateAccessToken}