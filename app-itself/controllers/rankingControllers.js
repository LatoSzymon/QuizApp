const User = require("../models/usersModel");
const { Quiz } = require("../config/index");
const QuizSession = require("../models/quizSessionModel");
const { Op } = require("sequelize");

const getGlobalRanking = async (req, res) => {
    try {
        const users = await User.findAll({
            order: [["totalScore", "DESC"]],
            limit: 10,
            attributes: ["id", ]
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({message: "Nie poszło coś przy rankingach", error: error.message});
    }
};

const getWeeklyRanking = async (req, res) => {
    try {
        const longTimeAgo = new Date();
        longTimeAgo.setDate(longTimeAgo.getDate() - 7);
        const sessions = await QuizSession.find({endTime: {$gte: longTimeAgo}, isCompleted: true});
        const userPoints = {};

        for (const session of sessions) {
            if (!userPoints[session.userId]) {
                userPoints[session.userId] = 0;
            }
            userPoints[session.userId] += session.score;
        }

        const sorted = Object.entries(userPoints)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10);

        const result = await Promise.all(sorted.map(async ([userId, score]) => {
            const user = await User.findByPk(userId, { attributes: ["username"]});

            return { userId, username: user?.username || "Nieznany użytkownik", weeklyScore: score};
        }));

        res.json(result);
        
    } catch (err) {
        res.status(500).json({message: "Błąd przy tygodzniowym rankingu", error: err.message});
    }
};

const tagRanging = async (req, res) => {
    try {
        const {tag} = req.params;
        const matching = await Quiz.findAll({
            include: [{
                model: require("../models/tag"),
                where: { name: tag }
            }],
            attributes: ["id"]
        });


        const quizIds = matching.map(q => q.id);
        const sessions = await QuizSession.find({ quizId: { $in: quizIds}, isCompleted: true});
        const userPoints = {};

        for (const s of sessions) {
            if (!userPoints[s.userId]) {
                userPoints[s.userId] = 0;
            }
            userPoints[s.userId] += s.score;
        }

        const sorted = Object.entries(userPoints)
            .sort(([, a], [, b]) => b - a)
            .slice(0,10);

        const result = await Promise.all(sorted.map(async ([userId, score]) => {
            const user = await User.findByPk(userId, { attributes: ["username"]});
            return {userId, username: user?.username || "Nieznany Użytkownik", Score: score};
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({message: "Nie udało się zrobić rankingu po tagach", error: error.message});
    }
};

const catRanking = async (req, res) => {
        try {
        const {categoryId} = req.params;
        const matching = await Quiz.findAll({
            where: { categoryId: categoryId},
            attributes: ["id"]
        });

        const quizIds = matching.map(q => q.id);
        const sessions = await QuizSession.find({ quizId: { $in: quizIds}, isCompleted: true});
        const userPoints = {};

        for (const s of sessions) {
            if (!userPoints[s.userId]) {
                userPoints[s.userId] = 0;
            }
            userPoints[s.userId] += s.score;
        }

        const sorted = Object.entries(userPoints)
            .sort(([, a], [, b]) => b - a)
            .slice(0,10);

        const result = await Promise.all(sorted.map(async ([userId, score]) => {
            const user = await User.findByPk(userId, { attributes: ["username"]});
            return {userId, username: user?.username || "Nieznany Użytkownik", Score: score};
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({message: "Nie udało się zrobić rankingu po kategoriach", error: error.message});
    }
};

module.exports = {getGlobalRanking, getWeeklyRanking, tagRanging, catRanking};
