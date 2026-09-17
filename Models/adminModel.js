const { getPool } = require("../Config/db");

async function getAdminByEmail(email) {

    const pool = await getPool();

    const [rows] = await pool.query(
        `
            SELECT
                id,
                email,
                password_hash,
                name,
                otp_hash,
                otp_expires_at,
                otp_attempts
            FROM Admins
            WHERE email = ?
        `,
        [email]
    );

    return rows[0] || null;
}


async function saveOTP(adminId, otpHash, expiresAt) {

    const pool = await getPool();

    await pool.query(
        `
            UPDATE Admins
            SET
                otp_hash = ?,
                otp_expires_at = ?,
                otp_attempts = 0,
                updated_at = NOW()
            WHERE id = ?
        `,
        [otpHash, expiresAt, adminId]
    );
}


async function incrementOTPAttempts(adminId) {

    const pool = await getPool();

    await pool.query(
        `
            UPDATE Admins
            SET otp_attempts = otp_attempts + 1
            WHERE id = ?
        `,
        [adminId]
    );
}


async function clearOTP(adminId) {

    const pool = await getPool();

    await pool.query(
        `
            UPDATE Admins
            SET
                otp_hash = NULL,
                otp_expires_at = NULL,
                otp_attempts = 0,
                updated_at = NOW()
            WHERE id = ?
        `,
        [adminId]
    );
}


module.exports = {
    getAdminByEmail,
    saveOTP,
    incrementOTPAttempts,
    clearOTP
};