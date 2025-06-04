const mongoBongo = require("mongoose");

const AnswerSchema = new mongoBongo.Schema({
    questionId: {
        type: Number,
        required: true
    },
    selected: {
        type: [String],
        required: true
    },
    isCorrect: {
        type: Boolean
    }
});

const QuizSessionSchema = new mongoBongo.Schema({
    userId: {
        type: Number,
        required: true,
        ref: "User"
    },
    quizId: {
        type: Number,
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    currentQuestionIndex: {
        type: Number,
        default: 0
    },
    answers: [AnswerSchema],
    isCompleted: {
        type: Boolean,
        default: false
    },
    score: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoBongo.model("QuizSession", QuizSessionSchema);