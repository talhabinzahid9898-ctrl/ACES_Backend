const { sql, getPool } = require("../config/db");


// ==========================================
// GET ALL
// ==========================================

const getAllServices = async () => {

    const pool = getPool();

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
};


// ==========================================
// GET ONE
// ==========================================

const getServiceById = async (id) => {

    const pool = getPool();

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
};


// ==========================================
// CREATE
// ==========================================

const createService = async (
    title,
    category,
    description,
    status
) => {

    const pool = getPool();

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
};


// ==========================================
// UPDATE
// ==========================================

const updateService = async (
    id,
    title,
    category,
    description,
    status
) => {

    const pool = getPool();

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
};


// ==========================================
// DELETE
// ==========================================

const deleteService = async (id) => {

    const pool = getPool();

    const result = await pool
        .request()
        .input("id", sql.Int, Number(id))
        .query(`
            DELETE FROM services
            WHERE id = @id
        `);

    return result;
};


module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};