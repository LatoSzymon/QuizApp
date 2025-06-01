const errorHandler = (err, req, res, next) => {
    console.error("BŁĄD... wiel BŁĄD", err.stack || err);
    res.status(err.status || 500).json({
        message: err.message || "Błąd serwera"
    });
};

module.exports = errorHandler;