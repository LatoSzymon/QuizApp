const Option = require("../models/options");

const addOption = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { text, isCorrect } = req.body;
        const option = await Option.create({ text, isCorrect, questionId });

        res.status(201).json({ message: "Odpowiedź dodana", data: option });
    } catch (r) {
        res.status(500).json({ message: "Nie udało się dodać odpowiedzi", error: r.message });
    }
};

const getOptionsForQuest = async (req, res) => {
    try {
        const { questionId } = req.params;
        const options = await Option.findAll({ where: { questionId } });

        res.status(200).json({ data: options });
    } catch (ree) {
        res.status(500).json({ message: "Nie udało się pobrać odpowiedzi", error: ree.message });
    }
};

module.exports = {addOption, getOptionsForQuest};