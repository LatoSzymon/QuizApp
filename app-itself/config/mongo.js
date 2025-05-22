const amongus = require("mongoose");
require("dotenv").config();

const connectMDB = async () => {
    try {
        await amongus.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("No i elegancko wszystko śmiga z MongoDB");
        
    } catch (error) {
        console.error("Nie poszło coś lol", error);
    }
};

module.exports = connectMDB;