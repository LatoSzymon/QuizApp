const { DataTypes } = require("sequelize");
const seq = require("../config/sequelize");

const Quiz = seq.define("Quiz", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tags: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    tableName: "quizzes",
    timestamps: true
});

module.exports = Quiz;
