const { Quiz, Tag } = require("../config/index");

const createTag = async (req, res) => {
    try {
        const tag = await Tag.create({name: req.body.name});
        res.status(201).json(tag);
    } catch (erorus) {
        res.status(500).json({message: "Błąd przy tworzeniu taga, problemy jak lady Gaga joł", err: erorus});
    }
};

const getAllTag = async (req, res) => {
    try {
        const tag = await Tag.findAll();
        res.json(tag);
    } catch (er) {
        res.status(500).json({message: "Nie udało się pobrać, musisz lepszą kartę dobrać joł", error: er.message});
    }
};

const deleteTagussy = async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id);

        if (!tag) {
            return res.status(404).json({message: "Nie udało się pobrać tagu"});
        }

        await tag.destroy();
        res.json({message: "Usinięto tag"});
    } catch (error) {
        res.status(500).json({message: "Błąd przy taga usuwaniu, gorzej niż przy kiboli kopaniu joł", error: error.message});
    }
};

module.exports = {createTag, getAllTag, deleteTagussy};