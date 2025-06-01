const Quiz = require("../models/quizModelel");
const { Op } = require("sequelize");
const Tag = require("../models/tag");
const QuizSession = require("../models/quizSessionModel");

const createQuiz = async (req, res) => {
    try {
        const { title, description, isPublic, tags, categoryId, difficulty, duration, language } = req.body;

        if (!title || !description) {
            return res.status(400).json({message: "Wymagane są tytuł i opis"});
        }

        const validDifficulties = ["easy", "medium", "hard"];
        if (difficulty && !validDifficulties.includes(difficulty)) {
            return res.status(400).json({ message: "Nieprawidłowy poziom trudności. Dozwolone: easy, medium, hard" });
        }

        if (duration && (typeof duration !== "number" || duration <= 0)) {
            return res.status(400).json({ message: "Czas trwania musi być liczbą dodatnią (podaj w minutach)" });
        }

        await sequelize.transaction(async (t) => {
        const quizik = await Quiz.create({
            title,
            description,
            isPublic,
            authorId: req.user.userId,
            categoryId,
            difficulty,
            duration,
            language}, { transaction: t });

        if (tags?.length) {
            const tagRecords = await Promise.all(tags.map(name =>
            Tag.findOrCreate({ where: { name }, transaction: t })
            ));
            await quizik.setTags(tagRecords.map(([tag]) => tag), { transaction: t });
        }

        res.status(201).json({ message: "Quiz utworzony", quizik });
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
        const { categoryId, difficulty, language, tags, sort, page = 1, limit = 10 } = req.query;

        const where = {};
        const include = [];
        if (categoryId) where.categoryId = categoryId;
        if (difficulty) where.difficulty = difficulty;
        if (language) where.language = language;

        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : tags.split(",");
            include.push({
                model: Tag,
                where: { name: tagArray.length === 1 ? tagArray[0] : { [Op.in]: tagArray } }
            });
        }


        const offset = (parseInt(page) - 1) * parseInt(limit);

        const userId = req.user?.userId || null;

        const allQuizzes = await Quiz.findAll({ where, include });

        const baseQuizzes = allQuizzes.filter(quiz =>
            quiz.isPublic ||
            (userId && quiz.authorId === userId) ||
            (userId && Array.isArray(quiz.sharedWith) && quiz.sharedWith.includes(userId))
        );


        let quizzesWithPopularity = await Promise.all(
            baseQuizzes.map(async (quiz) => {
                const popularity = await QuizSession.countDocuments({ quizId: quiz.id });
                return {
                    ...quiz.toJSON(),
                    popularity
                };
            })
        );

        if (sort) {
            const direction = sort.startsWith("-") ? -1 : 1;
            const field = sort.replace("-", "");

            quizzesWithPopularity.sort((a, b) => {
                if (field === "popularity") {
                    return direction * (b.popularity - a.popularity);
                }
                if (a[field] < b[field]) return -1 * direction;
                if (a[field] > b[field]) return 1 * direction;
                return 0;
            });
        }

        const total = quizzesWithPopularity.length;
        const paginated = quizzesWithPopularity.slice(offset, offset + parseInt(limit));

        res.status(200).json({
            quizzes: paginated,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        });

    } catch (err) {
        res.status(500).json({ message: "Błąd przy pobieraniu quizów", err: err.message });
    }
};


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

const getQuizzesSharedToMe = async (req, res) => {
    try {
        const userId = req.user.userId;

        const quizzes = await Quiz.findAll({
            where: {
                isPublic: false
            }
        });

        const shared = quizzes.filter(q =>
            Array.isArray(q.sharedWith) &&
            q.sharedWith.includes(userId)
        );

        res.json(shared);
    } catch (err) {
        res.status(500).json({ message: "Błąd przy pobieraniu udostępnionych quizów", error: err.message });
    }
};

const shareQuizWithUser = async (req, res) => {
    try {
        const quiz = await Quiz.findByPk(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: "Nie znaleziono quizu" });
        }

        if (quiz.authorId !== req.user.userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Brak uprawnień" });
        }

        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "Brak userId" });
        }

        const shared = Array.isArray(quiz.sharedWith) ? quiz.sharedWith : [];
        if (!shared.includes(userId)) {
            shared.push(userId);
            quiz.sharedWith = shared;
            await quiz.save();
        }

        res.json({ message: "Quiz udostępniony użytkownikowi", sharedWith: quiz.sharedWith });

    } catch (err) {
        res.status(500).json({ message: "Błąd przy udostępnianiu quizu", error: err.message });
    }
};


module.exports = { createQuiz, getAllOfTheQuizzyWizzy, getQuizById, updateQuiz, deletusQuizus, getQuizzesSharedToMe, shareQuizWithUser };

