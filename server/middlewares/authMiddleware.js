const jwt = require('jsonwebtoken');
const asynchandler = require('express-async-handler');
const User = require('../models/userModel')
const dotenv = require('dotenv');
dotenv.config();

const protect = asynchandler(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = JSON.parse(req.headers.authorization.split(' ')[1]);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token verification failed');
        }
    }
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token provided');
    }
});

module.exports = { protect };