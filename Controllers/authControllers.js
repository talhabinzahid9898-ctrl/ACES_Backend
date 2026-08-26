const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
    getAdminByEmail,
    saveOTP,
    incrementOTPAttempts,
    clearOTP
} = require("../Models/adminModel");

const {
    generateOTP,
    hashOTP
} = require("../utils/otp");

const {
    sendOTPEmail
} = require("../config/mail");


/*
========================================================
LOGIN
========================================================
*/

async function login(req, res) {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }


        const admin = await getAdminByEmail(email);

        if (!admin) {

            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }


        const passwordCorrect = await bcrypt.compare(
            password,
            admin.password_hash
        );


        if (!passwordCorrect) {

            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }


        /*
        Generate OTP
        */

        const otp = generateOTP();

        const otpHash = hashOTP(otp);


        /*
        OTP expires after 5 minutes
        */

        const expiryMinutes =
            Number(process.env.ADMIN_OTP_EXPIRY_MINUTES) || 5;

        const expiresAt = new Date(
            Date.now() + expiryMinutes * 60 * 1000
        );


        await saveOTP(
            admin.id,
            otpHash,
            expiresAt
        );


        /*
        Send OTP
        */

        await sendOTPEmail(
            admin.email,
            otp
        );


        return res.json({

            success: true,

            message: "OTP sent to administrator email",

            requiresOTP: true,

            email: admin.email

        });

    }

    catch (error) {

        console.error("LOGIN ERROR:", error);

        return res.status(500).json({

            success: false,

            message: "Unable to process login"

        });
    }
}


/*
========================================================
VERIFY OTP
========================================================
*/

async function verifyOTP(req, res) {

    try {

        const { email, otp } = req.body;


        if (!email || !otp) {

            return res.status(400).json({

                success: false,

                message: "Email and OTP are required"

            });
        }


        const admin =
            await getAdminByEmail(email);


        if (!admin) {

            return res.status(401).json({

                success: false,

                message: "Invalid verification request"

            });
        }


        /*
        Limit OTP attempts
        */

        if (admin.otp_attempts >= 5) {

            return res.status(429).json({

                success: false,

                message:
                    "Too many incorrect OTP attempts. Please login again."

            });
        }


        /*
        Check whether OTP exists
        */

        if (
            !admin.otp_hash ||
            !admin.otp_expires_at
        ) {

            return res.status(400).json({

                success: false,

                message: "OTP is invalid or has expired"

            });
        }


        /*
        Check expiration
        */

        const expiresAt =
            new Date(admin.otp_expires_at);


        if (Date.now() > expiresAt.getTime()) {

            await clearOTP(admin.id);

            return res.status(400).json({

                success: false,

                message: "OTP has expired. Please login again."

            });
        }


        /*
        Compare OTP hash
        */

        const submittedHash =
            hashOTP(otp);


        if (
            submittedHash !== admin.otp_hash
        ) {

            await incrementOTPAttempts(admin.id);

            return res.status(401).json({

                success: false,

                message: "Incorrect OTP"

            });
        }


        /*
        OTP correct
        */

        await clearOTP(admin.id);


        /*
        Create JWT
        */

        const token = jwt.sign(

            {
                id: admin.id,
                email: admin.email,
                role: "admin"
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "2h"
            }

        );


        return res.json({

            success: true,

            message: "Login successful",

            token,

            admin: {

                id: admin.id,

                name: admin.name,

                email: admin.email,

                role: "admin"

            }

        });

    }

    catch (error) {

        console.error("VERIFY OTP ERROR:", error);

        return res.status(500).json({

            success: false,

            message: "Unable to verify OTP"

        });
    }
}


/*
========================================================
LOGOUT
========================================================
*/

function logout(req, res) {

    return res.json({

        success: true,

        message: "Logged out successfully"

    });

}


module.exports = {

    login,
    verifyOTP,
    logout

};