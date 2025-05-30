const Question = require("../models/Question");

const createQuestion = async (req, res) => {
    try {
        const { pytanie } = req.body;
        const { quizId } = req.params;
        const question = await Question.create({text, quizId});
        res.status(201).json({msg: `stworzono pytanie do quizu o id ${quizId}`, question});
    } catch (err) {
        res.status(500).json({msg: "Błą ą ąąą ą ąą ąąd", error: err.message});
    }
};

const getQuestionsForQuiz = async (req, res) => {
    try {
        const {quizId} = req.params;
        const questions = await Question.findAll({where: {quizId}});
        res.status(200).json(questions);
    } catch (errere){
        res.status(500).json({a: "Nie udało się pobrać pytań", err: errere.message});
    }
};

module.exports = {createQuestion, getQuestionsForQuiz};
