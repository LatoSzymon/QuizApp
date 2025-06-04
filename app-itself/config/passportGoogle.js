const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    accessType: "offline",
    prompt: "consent"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ where: { email } });

        if (!user) {
            user = await User.create({
                username: profile.displayName,
                email,
                password: await bcrypt.hash(Math.random().toString(36).slice(-10), 10),
                role: "user",
                authProvider: "google"
            });
        }

        return done(null, user.toJSON());
    } catch (err) {
        console.error("Passport strategy error:", err);
        return done(err, null);
    }
}));
