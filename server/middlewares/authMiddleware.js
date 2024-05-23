const jwt=require('jsonwebtoken');
const asynchandler=require('express-async-handler');
const User=require('../models/userModel')

const protect=asynchandler(async(req,res,next)=>{
    let token;
    token=req.cookies.user;
    if(token){
        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            req.user = await User.findById(decoded.userId).select('-paasword');
            next();
        }catch(error){
            res.status(401);
            throw new Error("not authorized, no token");
        }
    }else{
        res.status(401);
        throw new Error("not authorized, no token");
    }
});

module.exports ={protect};