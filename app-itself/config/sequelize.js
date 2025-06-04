require("dotenv").config();
const { Sequelize } = require("sequelize");

console.log("DANE BAZY:");
console.log("host:", process.env.DB_HOST);
console.log("user:", process.env.DB_USER);
console.log("pass:", process.env.DB_PASSWORD);
console.log("db:", process.env.DB_NAME);

const seq = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: "mysql",
        pool: {
            max: 10,
            min: 2,
            acquire: 30000,
            idle: 10000
        },
        retry: {
            max: 10,
        },
        logging: false,
    }
);

module.exports = seq;

