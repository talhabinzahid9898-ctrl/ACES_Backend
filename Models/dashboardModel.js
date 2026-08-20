"use strict";

const { getPool, sql } = require("../Config/db");


// =====================================================
// GET DASHBOARD STATISTICS
// =====================================================

async function getDashboardStats() {

    const pool = await getPool();

    // -------------------------------------------------
    // PROJECTS
    // -------------------------------------------------

    const projectsResult = await pool.request().query(`
        SELECT COUNT(*) AS total
        FROM Projects
    `);


    // -------------------------------------------------
    // SERVICES
    // -------------------------------------------------

    const servicesResult = await pool.request().query(`
        SELECT COUNT(*) AS total
        FROM services
    `);


    // -------------------------------------------------
    // PUBLISHED BLOGS
    // -------------------------------------------------

    const blogsResult = await pool.request().query(`
        SELECT COUNT(*) AS total
        FROM Blogs
        WHERE status = 1
    `);


    // -------------------------------------------------
    // TEAM MEMBERS
    // -------------------------------------------------

    const teamsResult = await pool.request().query(`
        SELECT COUNT(*) AS total
        FROM Teams
    `);


    return {

        projects:
            projectsResult.recordset[0].total,

        services:
            servicesResult.recordset[0].total,

        blogs:
            blogsResult.recordset[0].total,

        teams:
            teamsResult.recordset[0].total
    };
}


// =====================================================
// GET RECENT ACTIVITIES
// =====================================================

async function getRecentActivities() {

    const pool = await getPool();

    /*
     * We collect recent records from all content tables.
     *
     * created_at / updated_at are used to determine
     * when the activity happened.
     */

    const result = await pool.request().query(`

        SELECT TOP 10
            activity_type,
            title,
            description,
            activity_date
        FROM
        (

            -- PROJECTS
            SELECT
                'project' AS activity_type,
                title AS title,
                'Project was added or updated.' AS description,
                ISNULL(updated_at, created_at) AS activity_date
            FROM Projects


            UNION ALL


            -- SERVICES
            SELECT
                'service' AS activity_type,
                title AS title,
                'Service was added or updated.' AS description,
                ISNULL(updated_at, created_at) AS activity_date
            FROM services


            UNION ALL


            -- BLOGS
            SELECT
                'blog' AS activity_type,
                title AS title,
                'Blog article was added or updated.' AS description,
                ISNULL(updated_at, created_at) AS activity_date
            FROM Blogs


            UNION ALL


            -- TEAMS
            SELECT
                'team' AS activity_type,
                name AS title,
                'Team member was added or updated.' AS description,
                ISNULL(updated_at, created_at) AS activity_date
            FROM Teams

        ) AS activities

        WHERE activity_date IS NOT NULL

        ORDER BY activity_date DESC

    `);

    return result.recordset;
}


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    getDashboardStats,
    getRecentActivities
};