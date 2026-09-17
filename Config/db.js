const mysql = require("mysql2/promise");
require("dotenv").config();

const config = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

    ssl: {
        rejectUnauthorized: false
    },

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool = null;


// ==========================================
// CONNECT DATABASE
// ==========================================

async function connectDB() {

    try {

        if (pool) {
            return pool;
        }

        pool = mysql.createPool(config);

        // verify the pool can actually reach Aiven
        const connection = await pool.getConnection();
        connection.release();

        console.log("✅ MySQL (Aiven) Connected Successfully");

        return pool;

    } catch (error) {

        pool = null;

        console.error("❌ Database Connection Failed");
        console.error(error);

        throw error;
    }
}


// ==========================================
// GET DATABASE POOL
// ==========================================

async function getPool() {

    if (!pool) {
        await connectDB();
    }

    return pool;
}


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    mysql,
    connectDB,
    getPool
};