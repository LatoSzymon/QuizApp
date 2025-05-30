const { DataTypes } = require("sequelize");
const seq = require("../config/sequelize");

const Option = seq.define("Option", {
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    questionId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "options",
    timestamps: true
});

module.exports = Option;