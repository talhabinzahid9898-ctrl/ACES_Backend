const express = require("express");

const router = express.Router();

const {
    login,
    verifyOTP,
    logout
} = require("../controllers/authControllers");


/*
POST /api/auth/login
*/

router.post(
    "/login",
    login
);


/*
POST /api/auth/verify-otp
*/

router.post(
    "/verify-otp",
    verifyOTP
);


/*
POST /api/auth/logout
*/

router.post(
    "/logout",
    logout
);


module.exports = router;