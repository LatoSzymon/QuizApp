const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Rating = sequelize.define("Rating", {
    quizId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    }
}, {
    tableName: "ratings",
    timestamps: true
});

module.exports = Rating;