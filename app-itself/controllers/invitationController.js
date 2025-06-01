const QuizInvitation = require("../models/quizInvitation");
const Quiz = require("../models/quizModelel");
const User = require("../models/usersModel");

const sendInvitation = async (req, res) => {
    try {
        const { quizId, toUserId } = req.body;
        const fromUserId = req.user.userId;

        const quiz = await Quiz.findByPk(quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz nie istnieje" });

        const toUser = await User.findByPk(toUserId);
        if (!toUser) return res.status(404).json({ message: "Nie znaleziono użytkownika" });

        const invite = await QuizInvitation.create({
            quizId,
            fromUserId,
            toUserId
        });

        res.status(201).json({ message: "Wysłano zaproszenie", invitation: invite });
    } catch (err) {
        res.status(500).json({ message: "Błąd przy wysyłaniu zaproszenia", error: err.message });
    }
};

const getMyInvitations = async (req, res) => {
    try {
        const toUserId = req.user.userId;

        const invites = await QuizInvitation.findAll({
            where: { toUserId },
            order: [["createdAt", "DESC"]]
        });

        res.json(invites);
    } catch (err) {
        res.status(500).json({ message: "Błąd przy pobieraniu zaproszeń", error: err.message });
    }
};

const respondToInvitation = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const toUserId = req.user.userId;

        const valid = ["accepted", "rejected"];
        if (!valid.includes(status)) {
            return res.status(400).json({ message: "Nieprawidłowy status" });
        }

        const invite = await QuizInvitation.findByPk(id);
        if (!invite || invite.toUserId !== toUserId) {
            return res.status(404).json({ message: "Zaproszenie nie istnieje lub nie masz dostępu" });
        }

        invite.status = status;
        await invite.save();

        res.json({ message: "Zaktualizowano status zaproszenia", invitation: invite });
    } catch (err) {
        res.status(500).json({ message: "Błąd przy aktualizacji", error: err.message });
    }
};

module.exports = { sendInvitation, getMyInvitations, respondToInvitation };
