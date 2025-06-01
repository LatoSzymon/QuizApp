const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const GroupMembership = sequelize.define("GroupMembership", {
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM("member", "moderator", "admin"),
        defaultValue: "member"
    }
}, {
    tableName: "group_memberships",
    timestamps: true
});

module.exports = GroupMembership;
