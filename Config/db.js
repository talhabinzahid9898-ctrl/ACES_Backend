const sql = require("mssql");
require("dotenv").config();

const config = {
    user: process.env.DB_USER || undefined,
    password: process.env.DB_PASSWORD || undefined,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    database: process.env.DB_DATABASE,

    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    },

    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
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

        pool = await sql.connect(config);

        console.log("✅ SQL Server Connected Successfully");

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
    sql,
    connectDB,
    getPool
};