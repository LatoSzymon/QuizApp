const { DataTypes } = require("sequelize");
const seq = require("../config/sequelize");
const Category = require("./category");

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
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "categories",
            key: "id"
        },
    },
    difficulty: {
        type: DataTypes.ENUM("easy", "medium", "hard"),
        allowNull: false,
        defaultValue: "medium"
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    language: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sharedWith: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    }
}, {
    tableName: "quizzes",
    timestamps: true,
    indexes: [
        { fields: ["authorId"] },
        { fields: ["categoryId"] },
        { fields: ["difficulty"] },
        { fields: ["isPublic"] },
        { fields: ["language"] }
    ]

});

Quiz.belongsTo(Category, { foreignKey: "categoryId" });


module.exports = Quiz;
