const seq = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const User = seq.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    authProvider: {
        type: DataTypes.STRING,
        defaultValue: "local"
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    totalScore: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    quizzesCompleted: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    badges: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] },
    { fields: ['totalScore'] },
    { fields: ['role', 'authProvider'] }
  ]
});


module.exports = User;

