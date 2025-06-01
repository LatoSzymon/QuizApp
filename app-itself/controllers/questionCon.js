const Question = require("../models/Question");


const createQuestion = async (req, res) => {
    try {
        const { text, type, points, hint } = req.body;
        const { quizId } = req.params;

        if (!text) {
            return res.status(400).json({ message: "Pytanie musi mieć treść." });
        }

        const allowedTypes = ['single', 'multi', 'truefalse', 'open'];
        if (type && !allowedTypes.includes(type)) {
            return res.status(400).json({ message: "Nieprawidłowy typ pytania." });
        }

        const question = await Question.create({
            text,
            quizId,
            type: type || 'single',
            points: points || 1,
            hint: hint || null
        });


        res.status(201).json({ message: `Stworzono pytanie do quizu o ID ${quizId}`, data: question });
    } catch (err) {
        res.status(500).json({message: "Błą ą ąąą ą ąą ąąd", error: err.message});
    }
};

const getQuestionsForQuiz = async (req, res) => {
    try {
        const {quizId} = req.params;
        const questions = await Question.findAll({where: {quizId}});
        res.status(200).json(questions);
    } catch (errere){
        res.status(500).json({message: "Nie udało się pobrać pytań", err: errere.message});
    }
};

const updateQuestion = async (req, res) => {
    try {
        const {id} = req.params;
        const question = await Question.findByPk(id);

        if (!question) {
            return res.status(404).json({message: "Nie ma takiego pytania"});
        }

        const {text, type, points, hint} = req.body;
        if (type && !['single', "multi", "truefalse", "open"].includes(type)) {
            return res.status(400).json({message: "Niepoprawny typ pytania"});
        }

        await question.update({text, type, points, hint});
        res.status(200).json({message: "pytanie zostało zaktualizowane", question});
    } catch (err) {
        res.status(500).json({message: "Błąd przy aktualizacji pytania", error: err.message});
    }
};

const deleteQuestion = async (req, res) => {
    try {
        const {id} = req.params;
        const question = await Question.findByPk(id);
        if (!question) {
            return res.status(404).json({message: "Nie możesz usunąć pytania, którego nie ma cymbale"});
        }

        await question.destroy();

        res.status(200).json({message: `pytanie o id ${id} zostało pomyslnie usunięte z księgi żywych`});
    } catch (err) {
        res.status(500).json({message: "Błąd przy usuwaniu pyrtania", error: err.message});
    }
}

module.exports = {createQuestion, getQuestionsForQuiz, updateQuestion, deleteQuestion};
