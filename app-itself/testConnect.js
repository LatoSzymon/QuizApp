require("dotenv").config({ path: "../.env" });
const { Sequelize } = require("sequelize");

console.log("🔍 Próba połączenia z bazą...");

const seq = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false
  }
);

(async () => {
  try {
    await seq.authenticate();
    console.log("✅ Połączono!");
  } catch (err) {
    console.error("❌ Błąd połączenia:", err.message);
  } finally {
    await seq.close();
  }
})();
