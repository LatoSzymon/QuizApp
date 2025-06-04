const QuizSession = require("../models/quizSessionModel");
const { Quiz, Tag, QuizTag, Category, Option, Question } = require("../config/index");


const getUserStatsSummary = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

        const sessions = await QuizSession.find({userId, isCompleted: true});
        if (sessions.length === 0) {
            return res.status(200).json({ message: "Brak ukończonych quizów", summary: {} });
        }

        const totalSessions = sessions.length;
        const avgScore = Math.round(sessions.reduce((sum, s) => sum + s.percentage, 0) / totalSessions);

        const quizIds = [...new Set(sessions.map(s => s.quizId))];
        const quizzes = await Quiz.findAll({
            where: {id: quizIds},
            include: [Tag, Category]
        });

        const quizMap = {};

        quizzes.forEach(q => {
            quizMap[q.id] = {
                title: q.title,
                tags: q.Tags?.map(t => t.name) || [],
                category: q.Category?.name || null
            };
        });

        const tagStats = {};
        const categoryStats = {};
        const completedQuizzes = [];

        for (const s of sessions) {
            const quizInfo = quizMap[s.quizId];
            if (!quizInfo) {
                continue;
            }

            completedQuizzes.push({
                title: quizInfo.title,
                percentage: s.percentage,
                date: s.endTime
            });

            for (const tag of quizInfo.tags) {
                if (!tagStats[tag]) {
                    tagStats[tag] = [];
                }
                tagStats[tag].push(s.percentage);
            }

            const category = quizInfo.category;
            if (category) {
                if (!categoryStats[category]) {
                    categoryStats[category] = [];
                }
                categoryStats[category].push(s.percentage);
            }
        }

        const tagAverages = Object.entries(tagStats).map(([tag, values]) => ({
            tag,
            avg: values.reduce((a,b) => a+b, 0) / values.length
        }));

        const categoryAverages = Object.entries(categoryStats).map(([cat, values]) => ({
            category: cat,
            avg: values.reduce((a, b) => a + b, 0) / values.length
        }));

        const sortedTags = tagAverages.sort((a, b) => b.avg - a.avg);
        const sortedCats = categoryAverages.sort((a, b) => b.avg - a.avg);

        const bestTags = sortedTags.slice(0, 3).map(t => t.tag);
        const worstTags = sortedTags.slice(-3).map(t => t.tag);

        const bestCategories = sortedCats.slice(0, 3).map(c => c.category);
        const worstCategories = sortedCats.slice(-3).map(c => c.category);

        res.status(200).json({
            totalSessions,
            avgScore,
            bestTags,
            worstTags,
            bestCategories,
            worstCategories,
            completedQuizzes
        });

    } catch (err) {
        res.status(500).json({ message: "Błąd przy generowaniu statystyk", error: err.message });
    }
};

const getQuizStatsSummary = async (req, res) => {
    try {
        const quizId = parseInt(req.params.quizId);
        const quiz = await Quiz.findByPk(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Nie znaleziono quizu" });
        }

        const sessions = await QuizSession.find({ quizId, isCompleted: true });

        const popularity = sessions.length;
        const avgScore = popularity > 0
            ? Math.round(sessions.reduce((sum, s) => sum + (s.percentage || 0), 0) / popularity)
            : 0;

        const questions = await Question.findAll({ where: { quizId } });
        const questionStats = questions.map(q => ({
            id: q.id,
            text: q.text,
            attempts: 0,
            correct: 0
        }));

        for (const session of sessions) {
            for (const ans of session.answers) {
                const qStat = questionStats.find(q => q.id === ans.questionId);
                if (!qStat) continue;

                qStat.attempts += 1;
                if (ans.isCorrect) qStat.correct += 1;
            }
        }

        const processed = questionStats.map(q => ({
            questionId: q.id,
            text: q.text,
            attempts: q.attempts,
            correct: q.correct,
            accuracy: q.attempts > 0 ? Math.round((q.correct / q.attempts) * 100) : 0
        }));

        res.status(200).json({
            quizId,
            title: quiz.title,
            popularity,
            avgScore,
            questions: processed
        });

    } catch (err) {
        res.status(500).json({ message: "Błąd przy generowaniu statystyk quizu", error: err.message });
    }
};

module.exports = {getUserStatsSummary, getQuizStatsSummary};