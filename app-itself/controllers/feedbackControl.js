const Comment = require("../models/comment");
const Rating = require("../models/rating");

const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const { quizId } = req.params;

        const comment = await Comment.create({
            quizId,
            userId: req.user.userId,
            username: req.user.username,
            text
        });

        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ message: "Błąd przy dodawaniu komentarza", error: err.message });
    }
};

const getComments = async (req, res) => {
    try {
        const { quizId } = req.params;
        const comments = await Comment.findAll({ where: { quizId }, order: [["createdAt", "DESC"]] });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: "Błąd przy pobieraniu komentarzy", error: err.message });
    }
};

const addRating = async (req, res) => {
    try {
        const { score } = req.body;
        const { quizId } = req.params;

        const [rating, created] = await Rating.upsert({
            quizId,
            userId: req.user.userId,
            score
        }, {
            where: { quizId, userId: req.user.userId }
        });

        res.status(200).json({ message: "Ocena została zapisana", rating });
    } catch (err) {
        res.status(500).json({ message: "Błąd przy dodawaniu oceny", error: err.message });
    }
};

const getAverageRating = async (req, res) => {
    try {
        const { quizId } = req.params;
        const ratings = await Rating.findAll({ where: { quizId } });

        if (!ratings.length) return res.json({ average: null, count: 0 });

        const total = ratings.reduce((sum, r) => sum + r.score, 0);
        const average = total / ratings.length;

        res.json({ average: average.toFixed(2), count: ratings.length });
    } catch (err) {
        res.status(500).json({ message: "Błąd przy liczeniu średniej", error: err.message });
    }
};

module.exports = { addComment, getComments, addRating, getAverageRating };
