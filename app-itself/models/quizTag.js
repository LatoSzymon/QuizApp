const { DataTypes } = require("sequelize");
const seq = require("../config/sequelize");

const QuizTag = seq.define("QuizTag", {}, { tableName: "quiz_tags" });

module.exports = QuizTag;
