const express = require('express');
const router = express.Router();
const { register, login, topicSelection, createQuestion, getRandomQuestions, result, scorecards, leaderboard, logout } = require('../controllers/userController')
const { protect } = require('../middlewares/authMiddleware')

router.post('/register', register);
router.post('/login', login);
router.post('/topics/select', protect, topicSelection);
router.post('/questions', protect, createQuestion)
router.get('/quiz', getRandomQuestions)
router.post('/result', protect, result)
router.get('/scorecards', protect, scorecards)
router.get('/leaderboard', protect, leaderboard);
router.get('/logout', logout);

module.exports = router;