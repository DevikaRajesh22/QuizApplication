const mongoose = require('mongoose');

const resultSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    marks: {
        type: Number,
        required: true,
    },
    topics: {
        type: [String],
        required: true
    },
    timeTaken: {
        type: Number,
        required: true,
    },
},
    {
        timestamps: true,
    });

const Result = mongoose.model('Result', resultSchema)


module.exports = Result;