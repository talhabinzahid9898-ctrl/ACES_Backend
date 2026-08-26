"use strict";

const {
    getPool,
    sql
} = require("../Config/db");


// ============================================================
// GET DASHBOARD STATISTICS
// ============================================================

async function getDashboardStats() {

    const pool = await getPool();

    const result = await pool.request().query(`

        SELECT

            /* ============================
               TOTAL PROJECTS
            ============================ */

            (
                SELECT COUNT(*)
                FROM Projects
            ) AS totalProjects,


            /* ============================
               ACTIVE SERVICES
            ============================ */

            (
                SELECT COUNT(*)
                FROM Services
                WHERE
                    TRY_CONVERT(INT, status) = 1
                    OR LOWER(CONVERT(NVARCHAR(50), status)) = 'published'
            ) AS activeServices,


            /* ============================
               PUBLISHED BLOGS
            ============================ */

            (
                SELECT COUNT(*)
                FROM Blogs
                WHERE
                    TRY_CONVERT(INT, status) = 1
                    OR LOWER(CONVERT(NVARCHAR(50), status)) = 'published'
            ) AS publishedBlogs,


            /* ============================
               ACTIVE TEAM MEMBERS
            ============================ */

            (
                SELECT COUNT(*)
                FROM Teams
                WHERE
                    TRY_CONVERT(INT, status) = 1
                    OR LOWER(CONVERT(NVARCHAR(50), status)) = 'active'
            ) AS activeTeamMembers

    `);

    return result.recordset[0];
}


// ============================================================
// GET RECENT ACTIVITIES
// ============================================================

async function getRecentActivities() {

    const pool = await getPool();

    const result = await pool.request().query(`

        SELECT TOP 10

            activity_type,
            activity_title,
            activity_date

        FROM
        (

            /* ==========================================
               PROJECTS
            ========================================== */

            SELECT

                'Project' AS activity_type,

                project_title AS activity_title,

                created_at AS activity_date

            FROM Projects


            UNION ALL


            /* ==========================================
               SERVICES
            ========================================== */

            SELECT

                'Service' AS activity_type,

                title AS activity_title,

                created_at AS activity_date

            FROM Services


            UNION ALL


            /* ==========================================
               BLOGS
            ========================================== */

            SELECT

                'Blog' AS activity_type,

                title AS activity_title,

                COALESCE(
                    published_at,
                    created_at
                ) AS activity_date

            FROM Blogs

        ) AS Activities

        ORDER BY activity_date DESC

    `);

    return result.recordset;
}


// ============================================================
// GET COMPLETE DASHBOARD
// ============================================================

async function getDashboard() {

    const stats =
        await getDashboardStats();

    const activities =
        await getRecentActivities();

    return {
        stats,
        activities
    };
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    getDashboardStats,
    getRecentActivities,
    getDashboard
};