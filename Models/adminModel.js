const { sql, getPool } = require("../Config/db");

async function getAdminByEmail(email) {

    const pool = await getPool();

    const result = await pool
        .request()
        .input("email", sql.NVarChar(255), email)
        .query(`
            SELECT
                id,
                email,
                password_hash,
                name,
                otp_hash,
                otp_expires_at,
                otp_attempts
            FROM Admins
            WHERE email = @email
        `);

    return result.recordset[0] || null;
}


async function saveOTP(adminId, otpHash, expiresAt) {

    const pool = await getPool();

    await pool
        .request()
        .input("id", sql.Int, adminId)
        .input("otp_hash", sql.NVarChar(255), otpHash)
        .input("otp_expires_at", sql.DateTime2, expiresAt)
        .query(`
            UPDATE Admins
            SET
                otp_hash = @otp_hash,
                otp_expires_at = @otp_expires_at,
                otp_attempts = 0,
                updated_at = GETDATE()
            WHERE id = @id
        `);
}


async function incrementOTPAttempts(adminId) {

    const pool = await getPool();

    await pool
        .request()
        .input("id", sql.Int, adminId)
        .query(`
            UPDATE Admins
            SET otp_attempts = otp_attempts + 1
            WHERE id = @id
        `);
}


async function clearOTP(adminId) {

    const pool = await getPool();

    await pool
        .request()
        .input("id", sql.Int, adminId)
        .query(`
            UPDATE Admins
            SET
                otp_hash = NULL,
                otp_expires_at = NULL,
                otp_attempts = 0,
                updated_at = GETDATE()
            WHERE id = @id
        `);
}


module.exports = {
    getAdminByEmail,
    saveOTP,
    incrementOTPAttempts,
    clearOTP
};