const Group = require("../models/group");
const GroupMembership = require("../models/groupMembership");
const GroupQuiz = require("../models/groupQuiz");
const User = require("../models/usersModel");
const Quiz = require("../models/quizModelel");

const createGroup = async (req, res) => {
    try {
        const { name } = req.body;
        const ownerId = req.user.userId;

        const group = await Group.create({ name, ownerId });

        await GroupMembership.create({
            groupId: group.id,
            userId: ownerId,
            role: "admin"
        });

        res.status(201).json(group);
    } catch (err) {
        res.status(500).json({ message: "Błąd przy tworzeniu grupy", error: err.message });
    }
};

const inviteUserToGroup = async (req, res) => {
    try {
        const { userId } = req.body;
        const groupId = req.params.id;

        const existing = await GroupMembership.findOne({ where: { groupId, userId } });
        if (existing) return res.status(400).json({ message: "Użytkownik już jest w grupie" });

        await GroupMembership.create({ groupId, userId, role: "member" });
        res.json({ message: "Dodano użytkownika do grupy" });
    } catch (err) {
        res.status(500).json({ message: "Błąd przy zapraszaniu", error: err.message });
    }
};

const changeMemberRole = async (req, res) => {
    try {
        const { userId, role } = req.body;
        const groupId = req.params.id;

        const valid = ["member", "moderator", "admin"];
        if (!valid.includes(role)) return res.status(400).json({ message: "Nieprawidłowa rola" });

        const member = await GroupMembership.findOne({ where: { groupId, userId } });
        if (!member) return res.status(404).json({ message: "Nie znaleziono członka grupy" });

        member.role = role;
        await member.save();
        res.json({ message: "Zmieniono rolę" });
    } catch (err) {
        res.status(500).json({ message: "Błąd przy zmianie roli", error: err.message });
    }
};

const getUserGroups = async (req, res) => {
    try {
        const userId = req.user.userId;
        const memberships = await GroupMembership.findAll({ where: { userId } });

        const groupIds = memberships.map(m => m.groupId);
        const groups = await Group.findAll({ where: { id: groupIds } });

        res.json(groups);
    } catch (err) {
        res.status(500).json({ message: "Błąd przy pobieraniu grup", error: err.message });
    }
};

const assignQuizToGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        const { quizId } = req.body;

        const quiz = await Quiz.findByPk(quizId);
        if (!quiz) return res.status(404).json({ message: "Nie znaleziono quizu" });

        const exists = await GroupQuiz.findOne({ where: { groupId, quizId } });
        if (exists) return res.status(400).json({ message: "Quiz już przypisany do grupy" });

        await GroupQuiz.create({ groupId, quizId });
        res.json({ message: "Przypisano quiz do grupy" });
    } catch (err) {
        res.status(500).json({ message: "Błąd przy przypisywaniu quizu", error: err.message });
    }
};

const getGroupQuizzes = async (req, res) => {
    try {
        const groupId = req.params.id;

        const links = await GroupQuiz.findAll({ where: { groupId } });
        const quizIds = links.map(l => l.quizId);
        const quizzes = await Quiz.findAll({ where: { id: quizIds } });

        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: "Błąd przy pobieraniu quizów grupy", error: err.message });
    }
};

module.exports = {
    createGroup,
    inviteUserToGroup,
    changeMemberRole,
    getUserGroups,
    assignQuizToGroup,
    getGroupQuizzes
};
