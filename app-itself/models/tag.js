const {DataTypes} = require("sequelize");
const seq = require("../config/sequelize");

const Tag = seq.define("Tag", {
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
}, {
    tableName: "tags",
    timestamps: true
});

module.exports = Tag;