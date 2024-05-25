const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const Question = require('../models/questionModel');
const Result = require('../models/resultModel');
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

const createQuestion = asyncHandler(async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
})

const getRandomQuestions = asyncHandler(async (req, res) => {
    try {
        const topics = req.query.topics;
        if (!topics) {
            return res.status(400).json({ success: false, message: 'No topics provided' });
        }
        const topicsArray = Array.isArray(topics) ? topics : [topics];
        const totalNumQuestions = 5;
        const numQuestionsPerTopic = Math.ceil(totalNumQuestions / topicsArray.length);
        let questions = [];
        for (const topic of topicsArray) {
            const topicQuestions = await Question.aggregate([
                { $match: { topic: topic } },
                { $sample: { size: numQuestionsPerTopic } }
            ]);
            questions = questions.concat(topicQuestions);
        }
        if (questions.length > totalNumQuestions) {
            questions = questions.slice(0, totalNumQuestions);
        }
        res.status(200).json({ success: true, data: questions });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
})

const result = asyncHandler(async (req, res) => {
    try {
        const { selectedAnswers, selectedTopics, timeTaken } = req.body;
        let totalMarks = 0;
        const userId = req.user._id;
        for (const questionId in selectedAnswers) {
            if (selectedAnswers.hasOwnProperty(questionId)) {
                const selectedAnswer = selectedAnswers[questionId];
                const question = await Question.findById(questionId);
                if (!question) {
                    console.error(`Question with ID ${questionId} not found`);
                    continue;
                }
                if (selectedAnswer === question.correctAnswer) {
                    totalMarks += question.marks;
                }
            }
        }
        const newResult = {
            userId: userId,
            marks: totalMarks,
            topics: selectedTopics,
            timeTaken: timeTaken
        };
        const result = new Result(newResult);
        await result.save();
        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


const scorecards = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const results = await Result.find({ userId });
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
})

const leaderboard = asyncHandler(async (req, res) => {
    try {
        const results = await Result.find().populate('userId').sort({ marks: -1, timeTaken: 1 });
        res.status(200).json({ success: true, data: results })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
})

const logout = asyncHandler(async (req, res) => {
    try {
        res.cookie('userToken', '', {
            httpOnly: true,
            expires: new Date(0)
        });
        res.status(200).json({ message: " user logged Out" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
})

module.exports = { register, login, topicSelection, createQuestion, getRandomQuestions, result, scorecards, leaderboard, logout };