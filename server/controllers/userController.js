const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const Question=require('../models/questionModel');
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
            const token = generateToken(res, user._id, 'userToken');
            res.status(201).json({
                token: token,
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
        res.status(500).json({ message: "Internal Server Error" });
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
                const token = generateToken(res, user._id, 'userToken');
                res.status(201).json({
                    token: token,
                    status: true,
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                });
            } else {
                res.status(200).json({ status: false, message: 'Wrong email or password' });
            }
        } else {
            res.status(200).json({ status: false, message: 'User doesn\'t exist' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

const topicSelection = asyncHandler(async (req, res) => {
    try {
        const { topics } = req.body;
        console.log(topics)
        if (!topics || !Array.isArray(topics)) {
            return res.status(400).json({ success: false, message: 'Invalid topics format' });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.selectedTopics = topics;
        await user.save();
        res.status(200).json({ success: true, message: 'Topics selected successfully' });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
})

const createQuestion=asyncHandler(async(req,res)=>{
    try{
        console.log('question controller')
        const { topic, question, correctAnswer, marks, options } = req.body;
        const newQuestion = new Question({
            topic,
            question,
            correctAnswer,
            marks,
            options
        });
        await newQuestion.save();
        res.status(201).json({ success: true, message: 'Question created successfully' });
    }catch(error){
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
})

module.exports = { register, login, topicSelection, createQuestion };