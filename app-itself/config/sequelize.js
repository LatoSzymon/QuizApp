const { Sequelize } = require("sequelize");

require("dotenv").config();
const seq = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        retry: {
            max: 10,
        },
        logging: false,
    }
);

module.exports = seq;

