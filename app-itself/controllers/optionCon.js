const Option = require("../models/options");

const addOption = async (req, res) => {
    try {
        const { questId } = req.params;
        const { text, isCorrect } = req.body;
        const option = await Option.create({text, isCorrect, questId});
        res.status(201).json({messaege: "Poszło i odpowiedź done", option});
    } catch (r) {
        res.status(500).json({mess: "Nie poszło i nie doszło", err: r.message});
    }
};

const getOptionsForQuest = async (req, res) => {
    try {
        const {questId} = req.params;
        const options = await Option.findAll({where: {questId}});

        res.status(200).json(options);
    } catch (ree) {
        res.status(500).json({ms: "Nie pobrano pytań", err: ree.message});
    }
};

module.exports = {addOption, getOptionsForQuest};