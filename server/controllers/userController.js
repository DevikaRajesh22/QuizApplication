const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken')
const swal = require('sweetalert2');

const register = asyncHandler(async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            res.status(200).json({ status: false, message: "Email already exists" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name: name, email: email, password: hashedPassword });
        await user.save();
        if (user) {
            generateToken(res, user._id, 'user');
            res.status(201).json({
                status: true,
                _id: user._id,
                name: user.name,
                email: user.email
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data')
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Error creating user" });
    }
})

const login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email });
        if (user) {
            const hashedPassword = user.password;
            const passwordMatch = await bcrypt.compare(password, hashedPassword);
            if (passwordMatch) {
                generateToken(res, user._id, 'user');
                res.status(201).json({
                    status: true,
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                });
            } else {
                res.status(200).json({ status: false, message: 'Wrong email or password' });
            }
        } else {
            res.status(200).json({ status: false, message: 'User doesn\'t exist' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Error creating user" });
    }
})

module.exports = { register, login };