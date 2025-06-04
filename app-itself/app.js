const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middleware/errorHandler");

require("dotenv").config({ path: "../.env" });

const authUserRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");
const optionRoutes = require("./routes/optionsRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const rankRoutes = require("./routes/rankingRoutes");
const categoryRoutes = require("./routes/categoriesRoutes");
const tagRoutes = require("./routes/tagRoutes");
const statsRoute = require("./routes/statsRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const invitationRoutes = require("./routes/invitationRoutes");
const groupRoutes = require("./routes/groupRoutes");

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 141,
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
app.use("/api/stats", rankRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/stats", statsRoute);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/groups", groupRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
    console.log("Api zaiwania jak ja na kinderkach");
    res.send("Dziaaaaaała");
});

module.exports = app;
