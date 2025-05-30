const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");

require("dotenv").config();

const rejestracja = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const existsMail = await User.findOne({ where: {email}});
        const existsUsername = await User.findOne({ where: {username}});

        if (existsMail || existsUsername) {
            return res.status(404).json({ message: "nick lub email już istnieje"});
        }
        const hashuMashu = await bcrypt.hash(password, 10);

        const user = await User.create({
            username, email, password: hashuMashu
        });

        res.status(201).json({message: "Utworzono użytkownika", userId: user.id, username: user.username});
    } catch (er) {
        res.status(500).json({message: "błąd na stacji rejestracji:", error: er.message});
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({where: {email}});
        if (!user) {
            return res.status(401).json({message: "nieprawidłowy mail"});
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({message: "nieprawidłowe hasło"});
        }

        const token = jwt.sign({ userId: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.json({token});

    } catch (er) {   
        res.status(500).json({message: "Nie poszło coś przy logowaniu", err: er.message});
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: ['id', 'username', 'email', 'role']
        });
        if (!user) {
            return res.status(404).json({message: "Nie znaleziono użytkownika"});
        }
        
        res.json(user);
    } catch (e) {
        res.status(500).json({message: "Błąd przy szukaniu użytkownika", err: e.message});
    }
};

module.exports = { rejestracja, login, getProfile };