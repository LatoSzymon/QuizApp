const { DataTypes } = require("sequelize");
const seq = require("../config/sequelize");

const Question = seq.define("Question", {
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quizId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: "questions",
    timestamps: true
});

module.exports = Question;