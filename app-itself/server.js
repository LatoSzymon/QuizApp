const express = require('express');
const cors = require("cors");
require("dotenv").config({ path: "../.env" });
const seq = require("./config/sequelize");
const connectMDB = require("./config/mongo");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    console.log("Api zaiwania jak ja na kinderkach");
    res.send("Dziaaaaaała");
});

seq.authenticate()
    .then(() => console.log("kurczak żywy"))
    .catch(err => console.error("kurczak martwy", err));

connectMDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Serwer śmiga jak legend liga elo żelo");
});

