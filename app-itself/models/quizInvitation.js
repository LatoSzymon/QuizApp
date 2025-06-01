const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const QuizInvitation = sequelize.define("QuizInvitation", {
    fromUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    toUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quizId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected"),
        defaultValue: "pending"
    }
}, {
    tableName: "quiz_invitations",
    timestamps: true
});

module.exports = QuizInvitation;
