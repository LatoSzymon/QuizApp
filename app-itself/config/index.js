const Quiz = require("../models/quizModelel");
const Question = require("../models/Question");
const Option = require("../models/options");
const Tag = require("../models/tag");
const Category = require("../models/category");
const QuizTag = require("../models/quizTag");

Quiz.hasMany(Question, { foreignKey: "quizId" });
Question.belongsTo(Quiz, {foreignKey: "quizId"});

Question.hasMany(Option, { foreignKey: "questionId" });
Option.belongsTo(Question, {foreignKey: "questionId"});

Quiz.belongsToMany(Tag, {
  through: QuizTag,
  foreignKey: "quizId",
  otherKey: "tagId"
});

Tag.belongsToMany(Quiz, {
  through: QuizTag,
  foreignKey: "tagId",
  otherKey: "quizId"
});



Quiz.belongsTo(Category, { foreignKey: "categoryId" });

module.exports = {
    Quiz, Tag, QuizTag, Category, Option, Question
};


