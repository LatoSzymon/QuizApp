const app = require("./app");
const seq = require("./config/sequelize");
const connectMDB = require("./config/mongo");

seq.authenticate()
    .then(() => console.log("kurczak żywy"))
    .catch(err => console.error("kurczak martwy", err));

seq.sync()
    .then(() => console.log("MSQL zsynchinowane"))
    .catch(err => console.log("Synchro nie poszło:", err));

connectMDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Serwer śmiga jak legend liga elo żelo");
});
