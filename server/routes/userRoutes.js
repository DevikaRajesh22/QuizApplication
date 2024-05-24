const express = require('express');
const router = express.Router();
const { register, login, topicSelection, createQuestion } = require('../controllers/userController')
const { protect } = require('../middlewares/authMiddleware')

router.post('/register', register);
router.post('/login', login);
router.post('/topics/select', protect, topicSelection);
router.post('/questions', createQuestion)

module.exports = router;