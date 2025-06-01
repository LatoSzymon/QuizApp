const express = require('express');
const cors = require("cors");
require("dotenv").config({ path: "../.env" });
const seq = require("./config/sequelize");
const connectMDB = require("./config/mongo");
const authUserRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");
const optionRoutes = require("./routes/optionsRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const statRoutes = require("./routes/rankingRoutes");
const categoryRoutes = require("./routes/categoriesRoutes");
const tagRoutes = require("./routes/tagRoutes");
const statsRoute = require("./routes/statsRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const invitationRoutes = require("./routes/invitationRoutes");
const groupRoutes = require("./routes/groupRoutes");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 153,
    message: "Za dużo żądań! To aplikacja a nie pewex. Spróbuj ponownie za 15 minut"
});

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(limiter);

app.use("/api/auth", authUserRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/options", optionRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/stats", statsRoute);
app.use("api/feedback", feedbackRoutes);
app.use("api/invitations", invitationRoutes);
app.use("api/groups", groupRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
    console.log("Api zaiwania jak ja na kinderkach");
    res.send("Dziaaaaaała");
});

seq.authenticate()
    .then(() => console.log("kurczak żywy"))
    .catch(err => console.error("kurczak martwy", err));

seq.sync({ alter: true })
    .then(() => console.log("MSQL zsynchinowane"))
    .catch(err => console.log("Synchro nie poszło:", err));

connectMDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Serwer śmiga jak legend liga elo żelo");
});
