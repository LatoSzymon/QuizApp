const Category = require("../models/category");

const createCategory = async (req, res) => {
    try {
        const {name, parentId} = req.body;
        const category = await Category.create({name, parentId});
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({message: "Błąd prz y tworzeniu kategorii", error: err.message});
    }
};

const getAllCats = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories)
    } catch (err) {
        res.status(500).json({message: "Błąd przy pobieraniu kategorii", error: err.message});
    }
};

const updateCategory = async (req, res) => {
    try {
        const {id} = req.params;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(500).json({message: "Nie ma takiej kategorii"});
        }

        await category.update(req.body);
        res.json(category);
    } catch (err) {
        res.status(500).json({message: "Błąd przy aktualizacji", error: err.message});
    }
};

const deleteCat = async (req, res) => {
    try {
        const {id} = req.params;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(500).json({message: "Nie ma takiej kategorii"});
        }

        await category.destroy();
        res.json({message: `usunięto kategorię o id ${id}`});
    } catch {
        res.status(500).json({message: "Błąd przy aborcji", error: err.message});
    }
};

module.exports = {createCategory, getAllCats, updateCategory, deleteCat};