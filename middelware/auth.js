const jwt = require('jsonwebtoken');
require('dotenv').config();


const generateAccessToken = async (user) => {
    try {
        const options = {
            expiresIn: "1h",
        }
        const accessToken = jwt.sign({ user }, process.env.ACCEESS_CODE, options);
        return accessToken;
    }
    catch (error) {
        console.log(error.message("Invalid token"));
    }
}


const verifyAccessToken = ((req, res, next) => {
    console.log(req.body);
    const tokenObj = req.headers.authentication;
    const jsontokenObj = JSON.parse(tokenObj)
    if (jsontokenObj.token == null) {
        res.status(404).send("Token Empty");
    }
    try {
        const decode = jwt.verify(jsontokenObj.token, process.env.ACCEESS_CODE);
        req.user = decode;
        next();
    }
    catch (error) {
        if (error.name == "TokenExpiredError") {
            res.status(401).send(error.name)
        } else {
            res.send(error.name)
        }
    }
})



const generateRefreshToken = async (user) => {
    try {
        console.log(user);
        const options = {
            expiresIn: "1y",
        }
        const refreshToken = jwt.sign({ user }, process.env.REFRESH_CODE, options);
        return refreshToken;
    }
    catch (error) {
        console.log(error.message("Invalid token"));
    }
}



const verifyRefreshToken = (async (token,req,res,next) => {
    if (token == null) {
        res.send("Refresh Token Empty")
    }
    try {
        const decode = jwt.verify(token, process.env.REFRESH_CODE);
        return decode;
    }
    catch (error) {
        if (error.name == "TokenExpiredError") {
            throw new Error(error.name)
        } else {
            throw new Error(error)
        }
    }
})


module.exports = { verifyAccessToken, generateAccessToken, generateRefreshToken, verifyRefreshToken }