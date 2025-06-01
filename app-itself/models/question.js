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
    type: {
        type: DataTypes.ENUM("single", "multi", "truefalse", "open"),
        allowNull: false,
        defaultValue: 'multi'
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    hint: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: "questions",
    timestamps: true
});

module.exports = Question;