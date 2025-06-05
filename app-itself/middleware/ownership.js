const { Quiz, Tag, QuizTag, Category, Option, Question } = require("../config/index");

const checkOwnership = async (req, res, next) => {
    try {
        const quId = req.params.quizIdFromQuestion || req.params.id;
        const userId = Number(req.user.userId);
        const usrRole = req.user.role;
        
        const quiz = await Quiz.findByPk(quId);
        console.log("quiz.authorId:", quiz.authorId, "userId:", userId, "role:", usrRole);

        if (!quiz) {
            return res.status(404).json({msg: "W Ba Sing Se nie ma takiego quizu"});
        }

        if (quiz.authorId === userId || usrRole === "admin") {
            next();
        } else {
            return res.status(403).json({message: "brak uprawnień UwU"});
        }

    } catch (rrr) {
        res.status(500).json({message: "Problemik się pojawił panie majster", err: rrr.message});
    }
};

const checkQuestionOwnership = async (req, res, next) => {
    try {
        const questionId = req.params.id;
        console.log("sprawdzamy pytanie o id: ",questionId);
        
        const question = await Question.findByPk(questionId);
        if (!question) {
            return res.status(404).json({message: "Nie znaleziono pytania"});
        }

        req.params.quizIdFromQuestion = question.quizId;

        return checkOwnership(req, res, next);
    } catch (er) {
        res.status(500).json({msg: "błąd przy sprawdzaniu właściciela pytania", err: er.message});
    }
};

module.exports = {checkOwnership, checkQuestionOwnership};
