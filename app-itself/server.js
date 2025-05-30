const express = require('express');
const cors = require("cors");
require("dotenv").config({ path: "../.env" });
const seq = require("./config/sequelize");
const connectMDB = require("./config/mongo");
const authUserRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");
const optionRoutes = require("./routes/optionsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authUserRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/options", optionRoutes);

app.get("/", (req, res) => {
    console.log("Api zaiwania jak ja na kinderkach");
    res.send("Dziaaaaaała");
});

seq.authenticate()
    .then(() => console.log("kurczak żywy"))
    .catch(err => console.error("kurczak martwy", err));

seq.sync({ force: false })
    .then(() => console.log("MSQL zsynchinowane"))
    .catch(err => console.log("Synchro nie poszło:", err));

connectMDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Serwer śmiga jak legend liga elo żelo");
});
