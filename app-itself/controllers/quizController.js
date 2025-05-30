const Quiz = require("../models/quizModelel");

const createQuiz = async (req, res) => {
    try {
        const { title, description, tags, isPub } = req.body;
        const quizik = await Quiz.create({
            title,
            description,
            isPub,
            tags,
            authorId: req.user.userId
        });
        
        res.status(201).json({ message: "Quiz został stworzony, mój Panie...", quizik });
    } catch (erer) {
        res.status(500).json({message: "coś tu poszło mocno nie tak :3", err: erer.message});
    }
};

const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findByPk(req.params.id);
        if (!quiz) {
            return res.status(404).json({message: "Nie znaleziono takiego quizu"});
        }
    
        res.status(200).json({quiz});
    } catch (err){
        res.status(500).json({mes: "Błąd", err: err.message});
    }
};

const getAllOfTheQuizzyWizzy = async (req, res) => {
    try {
        const quizyWszystkie = await Quiz.findAll();
        res.status(200).json(quizyWszystkie);
    } catch (er) {
        res.status(500).json({msg: "jakiś błąd", err: er.message});
    }
}

const updateQuiz = async (req, res) => {
    try{
        const quiz = await Quiz.findByPk(req.params.id);
        if (!quiz) {
            return res.status(404).json({message: "Nooooo nie ma czegoś takiego"});
        }

        await quiz.update(req.body);
        res.status(200).json({mes: "Quiz został zmieniony", quiz});
    } catch (err) {
        res.status(500).json({eeee: "Błąd w aktualizacji", eror: err.message});
    }
};

const deletusQuizus = async (req, res) => {
    try {
        const quiz = await Quiz.findByPk(req.params.id);
        if (!quiz) {
            return res.status(404).json({msg: "Nie znaleziono takiej pozycji, dokonaj proszę swej wątroby transpozycji"});
        }

        await quiz.destroy();
        res.status(200).json({mesg: "Wrogi i antypolski quiz został zdezintegrowany"});
    } catch (rr) {
        res.status(500).json({msg: "Coś tu poszło nie tak hehe", err: rr.message});
    }
};

module.exports = { createQuiz, getAllOfTheQuizzyWizzy, getQuizById, updateQuiz, deletusQuizus };

