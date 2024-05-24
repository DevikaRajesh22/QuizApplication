const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    correctAnswer: {
        type: String,
        required: true
    },
    marks: {
        type: Number,
        required: true
    },
    options: [{
        type: String,
        required: true
    }]
})

const Question = mongoose.model('Question', questionSchema)
module.exports = Question;