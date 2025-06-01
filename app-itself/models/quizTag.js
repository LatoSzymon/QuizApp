const Tag = require("./tag");
const { DataTypes } = require("sequelize");
const seq = require("../config/sequelize");
const Quiz = require("./quizModelel");

const QuizTag = seq.define("QuizTag", {}, { tableName: "quiz_tags" });

Quiz.belongsToMany(Tag, {through: QuizTag, foreignKey: "quizId"});
Tag.belongsToMany(Quiz, {through: QuizTag, foreignKey: "tagId"});

module.exports = QuizTag;
