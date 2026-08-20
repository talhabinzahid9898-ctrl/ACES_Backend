const { sql, getPool } = require("../Config/db");


// ==========================================
// GET ALL SERVICES
// ==========================================

async function getServices() {

    const pool = await getPool();

    const result = await pool
        .request()
        .query(`
            SELECT
                id,
                title,
                category,
                description,
                status,
                created_at
            FROM services
            ORDER BY created_at DESC
        `);

    return result.recordset;
}


// ==========================================
// GET ONE SERVICE
// ==========================================

async function getService(id) {

    const pool = await getPool();

    const result = await pool
        .request()
        .input("id", sql.Int, Number(id))
        .query(`
            SELECT
                id,
                title,
                category,
                description,
                status,
                created_at
            FROM services
            WHERE id = @id
        `);

    return result.recordset[0];
}


// ==========================================
// GET SERVICE BY ID
// ==========================================

async function getServiceById(id) {

    const pool = await getPool();

    const result = await pool
        .request()
        .input("id", sql.Int, Number(id))
        .query(`
            SELECT
                id,
                title,
                category,
                description,
                status,
                created_at
            FROM services
            WHERE id = @id
        `);

    return result.recordset[0];
}


// ==========================================
// CREATE SERVICE
// ==========================================

async function createService(
    title,
    category,
    description,
    status
) {

    const pool = await getPool();

    const result = await pool
        .request()
        .input("title", sql.VarChar(255), title)
        .input("category", sql.VarChar(100), category)
        .input("description", sql.VarChar(sql.MAX), description)
        .input("status", sql.VarChar(20), status)
        .query(`
            INSERT INTO services
            (
                title,
                category,
                description,
                status
            )
            OUTPUT INSERTED.id
            VALUES
            (
                @title,
                @category,
                @description,
                @status
            )
        `);

    return result.recordset[0].id;
}


// ==========================================
// UPDATE SERVICE
// ==========================================

async function updateService(
    id,
    title,
    category,
    description,
    status
) {

    const pool = await getPool();

    const result = await pool
        .request()
        .input("id", sql.Int, Number(id))
        .input("title", sql.VarChar(255), title)
        .input("category", sql.VarChar(100), category)
        .input("description", sql.VarChar(sql.MAX), description)
        .input("status", sql.VarChar(20), status)
        .query(`
            UPDATE services
            SET
                title = @title,
                category = @category,
                description = @description,
                status = @status
            WHERE id = @id
        `);

    return result;
}


// ==========================================
// DELETE SERVICE
// ==========================================

async function deleteService(id) {

    const pool = await getPool();

    const result = await pool
        .request()
        .input("id", sql.Int, Number(id))
        .query(`
            DELETE FROM services
            WHERE id = @id
        `);

    return result;
}


module.exports = {
    getServices,
    getService,
    getServiceById,
    createService,
    updateService,
    deleteService
};