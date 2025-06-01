const Question = require("../models/Question");
const QuizSession = require("../models/quizSessionModel");
const Option = require("../models/options");
const User = require("../models/usersModel");

const startSession = async (req, res) => {
    try {
        const { quizId } = req.body;
        const userId = req.user.userId;
        const existing = await QuizSession.findOne({ userId, quizId, isCompleted: false});

        if (existing) {
            return res.status(200).json({message: "Masz już aktywną sesję tego quizu. Po co odpalać następną jeśli można dokończyć tamtą? :3", session: existing});
        }

        const session = await QuizSession.create({
            userId, quizId, currentQuestionIndex:0, answers: [], isCompleted: false, score: 0 
        });

        res.status(201).json({message: `Nowa sesja dla quizu o id ${quizId} rozpoczęta i gotowa do działania`, session});
    } catch (err) {
        res.status(500).json({message: "Błąd przy startowaniu", error: err.message});
    }
};

const answerQuestion = async (req, res) => {
    try {
        const sessionId = req.params.id;
        const { questionId, selected } = req.body;
        const session = await QuizSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({message: "to brzmi jak istniejąca sesja... Coś takiego nie istnieje XDD"});
        }
        if (session.isCompleted) {
            return res.status(400).json({message: "Zakończono już tą sesję"});
        }

        const question = await Question.findByPk(questionId);
        if (!question) {
            return res.status(404).json({message: "Nie znaleziono pytania"});
        }

        switch (question.type) {
            case "truefalse":
                if (selected !== "true" && selected !== "false") {
                    return res.status(404).json({message: "Na taki typ pytania odpowiedz jeno true nebo false"});
                }
                break;
            
            case "single":
                if (!Array.isArray(selected) || selected.length !== 1) {
                    return res.status(404).json({message: "Podaj TYLKO jedną odpowiedź"});
                }
                break;

            case "multi":
                if (!Array.isArray(selected) || selected.length < 2) {
                    return res.status(404).json({message: "Więcej niż jedna odpowiedź wymaga wybrania"})
                }
                break;

            case "open":
                if (typeof selected !== "string") {
                    return res.status(404).json({message: "To pytanie otwarte, nie podawaj odpowiedzi w tablicy"});
                }
                break;
            
            default:
                return res.status(400).json({message: "nieznany typ pytania"});
            
        }
        
        if (question.type !== "open") {
            const vaildoweOpcje = await Option.findAll({ where: {questionId: question.id}});
            const validText = vaildoweOpcje.map(opt => opt.text);

            const check = Array.isArray(selected) ? selected : [selected];
            const allValid = check.every(odp => validText.includes(odp));

            if (!allValid) {
                return res.status(400).json({message: "Jedna lub więcej odpowiedzi nie należy do dostępnych opcji"});
            }
        }

        const existing = session.answers.find(odp => odp.questionId === questionId);
        if (existing) {
            existing.selected = selected;
        } else {
            session.answers.push({questionId, selected});
        }

        await session.save();
        res.status(200).json({message: "Odpowiedź została zapisana, mój panie", session});

    } catch (err) {
        res.status(500).json({message: "coś nie tak z odpowiedzią", err: err.message});   
    }
};

const theCompletionus = async (req, res) => {
    try {
        const sessionId = req.params.id;
        const session = await QuizSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({message: "Nie da się ukończyć sesji, której nie ma DUUUH"});
        }
        if (session.isCompleted) {
            return res.status(404).json({message: "Już zakończyłeś tą sesję, pajacu"});
        }

        const { quizId } = session;

        const question = await Question.findAll({where: {quizId}});
        let score = 0;
        let maxScore = 0;

        for (const q of question) {
            const questionPoints = q.points || 1;
            maxScore += questionPoints;

            const correctOptions = await Option.findAll({where: {
                questionId: q.id, isCorrect: true
            }});

            const correctAnswers = correctOptions.map(a => a.text).sort();
            const userAnswer = session.answers.find(x => x.questionId === q.id);
            if (userAnswer) {
                const userSelection = Array.isArray(userAnswer.selected) ? userAnswer.selected.sort() : [userAnswer.selected];

                const isCorrect = JSON.stringify(userSelection) === JSON.stringify(correctAnswers);
                userAnswer.isCorrect = isCorrect;

                if (isCorrect) {
                    score += questionPoints;
                }
            }
        }
        session.isCompleted = true;
        session.endTime = new Date();
        session.score = score;
        session.maxScore = maxScore;
        session.percentage = Math.round((score / maxScore) * 100);
        await session.save();
        const timediff = session.endTime - session.startTime;
        const minutesDiff = Math.round(timediff / 60000); 

        const user = await User.findByPk(session.userId);

        if (user) {
            user.totalScore += score;
            if (session.percentage >= 80) {
                user.quizzesCompleted += 1;
            }

            const badges = user.badges || [];
            if (session.percentage === 100 && !badges.find(b => b.name === "El Perfecto" && b.quizId === quizId)) {
                badges.push({
                    name: "El Perfecto",
                    description: "Przynajmniej raz zdobyto 100% w quizie",
                    quizId: quizId,
                    date: new Date().toISOString()
                });
            }

            if (session.percentage >= 80 && user.quizzesCompleted + 1 >= 10 && !badges.find(odz => odz.name === "Quizowy młody wilkołak")) {
                badges.push({
                    name: "Quizowy młody wilkołak",
                    description: "rozwiązano 10 quizów na przynajmniej 80%",
                    quizId: quizId,
                    date: new Date().toISOString()
                });
            }

            if (session.answers.some(ans => typeof ans.selected === "string" && ans.selected.toLowerCase().includes("marchewka")) && !badges.find(o => o.name === "MARCHEWA!")) {
                badges.push({
                    name: "MARCHEWA!",
                    description: "kto wie, dlaczego by nie oddam się pracy społecznej i będę ot choćby... sadzić... doć... marchew",
                    quizId: quizId,
                    date: new Date().toISOString()
                });
            }

            if (session.percentage >= 80 && user.quizzesCompleted + 1 >= 100 && !badges.find(ad => ad.name === "Piwniczak")) {
                badges.push({
                    name: "Piwniczak",
                    description: "Rozwiązałeś 100 quizów na przynajmniej 80%. Czas dotknąć trawy",
                    quizId: quizId,
                    date: new Date().toISOString()
                })
            }

            if (session.percentage >= 80 && minutesDiff <= 3 && !badges.find(a => a.name === "I AM SPEEEED")) {
                badges.push({
                    name: "I AM SPEEEED",
                    description: "Rozwiązałeś quiz w czasie 3 minut lub szybciej",
                    quizId: quizId,
                    date: new Date().toISOString()
                });
            }
        }

        res.status(200).json({message: "pomyślnie zakończono sesję", wynik: score, maxScore: maxScore, percentage: session.percentage, session});
    } catch (errorus) {
        res.status(500).json({message: "Nir udało się ukończyć sesji - błądzimy", error: errorus.message});
    }
};

const getSessionById = async (req, res) => {
    try {
        const sessionId = req.params.id
        const session = await QuizSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({message: "taka ssesja nie istnieje. Tak jak twoja mama lol"});
        }
        res.status(200).json({session});
    } catch (err) {
        res.status(500).json({message: "Błąd przy pobraniu sesji", error: err.message});
    }
};

const getUserSessions = async (req, res) => {
    try {
        const sessions = await QuizSession.find({userId: req.params.userId});
        res.status(200).json({sessions});
    } catch (error) {
        res.status(500).json({message: "Bardzo się starałeś, lecz sesji nie pobrałeś", error: error.message});
    }
};





module.exports = {startSession, answerQuestion, theCompletionus, getSessionById, getUserSessions};
