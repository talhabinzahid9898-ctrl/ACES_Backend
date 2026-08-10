// controllers/healthController.js

const getHealth = (req, res) => {

    res.status(200).json({
        success: true,
        message: "ACES Backend is running successfully",
        status: "OK"
    });

};

module.exports = {
    getHealth
};