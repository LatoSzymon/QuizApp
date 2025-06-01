const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const GroupQuiz = sequelize.define("GroupQuiz", {
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quizId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "group_quizzes",
    timestamps: true
});

module.exports = GroupQuiz;
