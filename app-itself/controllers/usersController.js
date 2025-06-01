const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");
const crypto = require("crypto");

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
            username, email, password: hashuMashu, authProvider: "local"
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

        if (user.authProvider !== "local") {
            return res.status(403).json({ message: "Zaloguj się przez Google" });
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
        const user = await User.findByPk(req.user.id, {
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

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({message: "nie ma takiego użytkownika"});
        }

        const {email, username, password} = req.body;
        if (email) {
            user.email = email;
        }
        if (username) {
            user.username = username
        }
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.status(200).json({message: "Profil zaktualizowany", user: {id: user.id, email: user.email, username: user.username, password: user.password}});
    } catch (error) {
        res.status(500).json({ message: "bład przy updateowaniu profilu", error: error.message});
    }
}

const forgotPassword = async (req, res) => {
    try { 
        const {email} = req.body;
        const user = await User.findOne({where: {email}});
        if (!user) {
            return res.status(404).json({message: "Nie znaleziono takiego użytkowanika"});
        }
        const token = crypto.randomBytes(20).toString("hex");
        user.resetToken = token;
        await user.save();

        res.json({message: "Token resetujący został wygenerowany pomyślnie", token});
    } catch (errr) {
        res.status(500).json({message: "Nie poszło przy zapomninaniu hasła", error: errr.message});
    }
};

const resetPassword = async (req, res) => {
    try {    const { token, newPassword } = req.body;
        const user = await User.findOne({ where: {resetToken: token}});
        if (!user) {
            return res.status(400).json({message: "Nieprawidłowy token. Nie można zresetować hasła"})
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null;
        await user.save();

        res.json({message: "Zmiana hasła przebiegła pomyślnie", user});}
    catch (err) {
        res.status(500).json({message: "Coś poszło nie tak przy zmianie hasła", error: err.message});
    }

};



module.exports = { rejestracja, login, getProfile, updateProfile, forgotPassword, resetPassword };