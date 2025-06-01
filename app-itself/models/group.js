const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Group = sequelize.define("Group", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "groups",
    timestamps: true
});

module.exports = Group;
