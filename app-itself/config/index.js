const Quiz = require("../models/quizModelel");
const Question = require("../models/Question");
const Option = require("../models/Option");

Quiz.hasMany(Question, { foreignKey: "quizId" });
Question.belongsTo(Quiz, {foreignKey: "quizId"});

Question.hasMany(Option, { foreignKey: "questionId" });
Option.belongsTo(Question, {foreignKey: "questionId"});



