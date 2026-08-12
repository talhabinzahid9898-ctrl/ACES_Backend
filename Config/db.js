const sql = require("mssql");
require("dotenv").config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,

    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

let pool;

async function connectDB() {
    try {

        pool = await sql.connect(config);

        console.log("✅ SQL Server Connected Successfully");

        return pool;

    } catch (err) {

        console.error("❌ Database Connection Failed");
        console.error(err);

        throw err;
    }
}

function getPool() {

    if (!pool) {
        throw new Error("Database pool is not connected.");
    }

    return pool;
}

module.exports = {
    connectDB,
    getPool,
    sql
};