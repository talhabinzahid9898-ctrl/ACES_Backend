const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === "true",

    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

async function sendOTPEmail(email, otp) {

    const mailOptions = {
        from: process.env.MAIL_FROM,

        to: email,

        subject: "ACES Admin Login Verification Code",

        html: `
        <!DOCTYPE html>

        <html>
        <head>
            <meta charset="UTF-8">
            <title>ACES OTP</title>
        </head>

        <body style="
            margin:0;
            padding:0;
            background:#f5f5f5;
            font-family:Arial,sans-serif;
        ">

            <div style="
                max-width:500px;
                margin:40px auto;
                background:white;
                padding:30px;
                border-radius:10px;
            ">

                <h2 style="margin-top:0;">
                    ACES Admin Verification
                </h2>

                <p>
                    A login attempt was made for your ACES
                    administrator account.
                </p>

                <p>
                    Your verification code is:
                </p>

                <div style="
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:8px;
                    padding:20px;
                    text-align:center;
                    background:#f1f1f1;
                    border-radius:8px;
                ">
                    ${otp}
                </div>

                <p>
                    This code will expire in
                    <strong>5 minutes</strong>.
                </p>

                <p>
                    If you did not attempt to log in,
                    please ignore this email.
                </p>

                <hr>

                <small>
                    ACES - Architectural & Civil Engineering Services
                </small>

            </div>

        </body>
        </html>
        `
    };

    await transporter.sendMail(mailOptions);
}

module.exports = {
    sendOTPEmail
};