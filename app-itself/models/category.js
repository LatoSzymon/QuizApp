const { DataTypes } = require("sequelize");
const seq = require("../config/sequelize");

const Category = seq.define("Category", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "categories",
            key: "id"
        }
    }
}, {
    tableName: "categories",
    timestamps: true
});

module.exports = Category;